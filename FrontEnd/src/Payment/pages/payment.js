import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Grid, TextField, Button, Typography } from '@mui/material';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const { courseCode, price } = useParams();
  const [clientSecret, setClientSecret] = useState("");
  const [courseDetails, setCourseDetails] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // New state for success message
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseRes = await axios.get(`http://localhost:4000/course/${courseCode}`);
        setCourseDetails(courseRes.data);
      } catch (err) {
        console.error("Error fetching course details:", err);
      }
    };

    fetchCourseDetails();
  }, [courseCode]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const paymentIntentRes = await axios.post(`http://localhost:4000/create-payment-intent`, {
          amount: price * 100,
        });
        setClientSecret(paymentIntentRes.data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
      }
    };

    createPaymentIntent();
  }, [price]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: event.target.name.value,
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        await axios.post('http://localhost:4000/pay-course', {
          studentId: 'your-student-id', // Replace with actual student ID
          courseId: courseCode,
          amount: price,
        });

        setPaymentSuccess(true); // Show success message
      }
    }
  };

  if (!courseCode) {
    return <div style={{ color: 'white' }}>No course selected</div>;
  }

  return (
    <div className="payment-page" style={{ backgroundColor: '#808080', color: 'white', padding: '20px' }}>
      <h2 style={{ color: 'white' }}>Complete Your Payment</h2>
      {paymentSuccess ? (
        <Typography variant="h5" style={{ color: 'green', marginTop: '20px' }}>
          Payment Successful! Thank you for your purchase.
        </Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Grid around the typography with orange background */}
            <Grid
              item
              xs={12}
              m={2}
              sx={{
                backgroundColor: '#f76b07',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              {courseDetails && (
                <Typography
                  variant="h6"
                  style={{ color: 'white', marginBottom: '8px' }}
                >
                  Course Name: {courseDetails.name}
                </Typography>
              )}
              <Typography
                variant="h6"
                style={{ color: 'white', marginBottom: '8px' }}
              >
                Course Code: {courseCode}
              </Typography>
              <Typography
                variant="h6"
                style={{ color: 'white' }}
              >
                Course Fee: Rs. {price}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="h6"
                style={{ color: 'white', margin: 'normal' }}
              >
                Please Enter Name of Card Holder:
              </Typography>
              <TextField
                label="Name on Card"
                name="name"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <div style={{ margin: '20px 0' }}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        color: '#fff',
                        fontSize: '16px',
                        '::placeholder': {
                          color: '#ccc',
                        },
                      },
                      invalid: {
                        color: '#ff6b6b',
                      },
                    },
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                sx={{
                  backgroundColor: '#f76b07',
                  borderRadius: '16px',
                  color: 'black', // Updated to black
                  '&:hover': {
                    backgroundColor: '#e65c00',
                  },
                  marginRight: '5%',
                  float: 'right',
                }}
                disabled={!stripe}
              >
                Pay Now
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </div>
  );
};

export default function WrappedPaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentPage />
    </Elements>
  );
}
