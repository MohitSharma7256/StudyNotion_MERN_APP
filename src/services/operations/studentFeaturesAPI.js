import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

// API Endpoints
const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

/**
 * Load Razorpay SDK Script
 */
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

/**
 * MAIN: Buy Course Flow
 * 1. Load Razorpay SDK
 * 2. Create Order (Backend)
 * 3. Open Razorpay Checkout
 * 4. On Success → Verify + Send Email
 */
export const buyCourse = async (
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) => {
  const toastId = toast.loading("Initializing payment...");

  try {
    // STEP 1: Load Razorpay SDK
    const scriptLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      toast.dismiss(toastId);
      return;
    }

    // STEP 2: Create Order via Backend
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // Validate Backend Response
    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message || "Order creation failed");
    }

    console.log("Order Response:", orderResponse);

    // Extract Order Data (Backend must return: { orderId, amount, currency })
    const { orderId, amount, currency } = orderResponse.data.data;

    // STEP 3: Razorpay Checkout Options
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY, // From .env
      currency: currency,                       // INR
      amount: amount,                           // In paise
      order_id: orderId,                        // Razorpay order ID
      name: "StudyNotion",
      description: "Thank you for purchasing the course",
      image: rzpLogo,
      prefill: {
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        email: userDetails.email,
      },
      theme: { color: "#3399cc" },

      // SUCCESS HANDLER
      handler: function (response) {
        // Send success email
        sendPaymentSuccessEmail(response, amount, token);

        // Verify payment with backend
        verifyPayment(
          { ...response, courses },
          token,
          navigate,
          dispatch
        );
      },

      // FAILURE HANDLER
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled");
          toast.dismiss(toastId);
        },
      },
    };

    // STEP 4: Open Razorpay Modal
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    // Optional: Handle payment failure
    paymentObject.on("payment.failed", function (response) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment Failed:", response.error);
      toast.dismiss(toastId);
    });
  } catch (error) {
    console.error("PAYMENT API ERROR:", error);
    toast.error(error.message || "Payment failed");
  } finally {
    toast.dismiss(toastId);
  }
};

/**
 * Send Payment Success Email
 */
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount: amount / 100, // Convert paise to rupees
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("Payment success email sent");
  } catch (error) {
    console.error("PAYMENT SUCCESS EMAIL ERROR:", error);
    // Don't block user experience
  }
}

/**
 * Verify Payment with Backend
 */
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying payment...");

  try {
    dispatch(setPaymentLoading(true));

    const response = await apiConnector(
      "POST",
      COURSE_VERIFY_API,
      bodyData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Verification failed");
    }

    // SUCCESS
    toast.success("Payment successful! You are now enrolled.");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.error("PAYMENT VERIFY ERROR:", error);
    toast.error("Payment verification failed");
  } finally {
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }
}