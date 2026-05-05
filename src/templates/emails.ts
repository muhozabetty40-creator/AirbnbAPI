// Each function takes the dynamic data and returns a complete HTML string
// In a real app you might use a templating engine like Handlebars or MJML
// for more complex designs

export function welcomeEmail(name: string, role: string): string {
  const message = role === "HOST" 
    ? "Create your first listing and start earning by sharing your space."
    : "Explore beautiful listings and book your next stay.";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF5A5F;">Welcome to Airbnb, ${name}!</h1>
      <p>Your account has been created successfully.</p>
      <p>${message}</p>
      <a href="http://localhost:3000" style="background: #FF5A5F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Get Started
      </a>
    </div>
  `;
}

export function bookingConfirmationEmail(
  guestName: string,
  listingTitle: string,
  location: string,
  checkIn: string,
  checkOut: string,
  totalPrice: number
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF5A5F;">Booking Confirmed!</h1>
      <p>Hi ${guestName},</p>
      <p>Your booking has been confirmed. Here are the details:</p>
      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Listing:</strong> ${listingTitle}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Check-in:</strong> ${checkIn}</p>
        <p><strong>Check-out:</strong> ${checkOut}</p>
        <p><strong>Total Price:</strong> $${totalPrice}</p>
      </div>
      <p style="color: #666; font-size: 14px;">
        <strong>Cancellation Policy:</strong> You can cancel your booking up to 48 hours before check-in for a full refund.
      </p>
      <a href="http://localhost:3000/bookings" style="background: #FF5A5F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        View Booking
      </a>
    </div>
  `;
}

export function bookingCancellationEmail(
  guestName: string,
  listingTitle: string,
  checkIn: string,
  checkOut: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF5A5F;">Booking Cancelled</h1>
      <p>Hi ${guestName},</p>
      <p>Your booking has been cancelled.</p>
      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Listing:</strong> ${listingTitle}</p>
        <p><strong>Check-in:</strong> ${checkIn}</p>
        <p><strong>Check-out:</strong> ${checkOut}</p>
      </div>
      <p>We'd love to help you find another listing!</p>
      <a href="http://localhost:3000" style="background: #FF5A5F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Browse Listings
      </a>
    </div>
  `;
}

export function passwordResetEmail(name: string, resetLink: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF5A5F;">Password Reset Request</h1>
      <p>Hi ${name}, we received a request to reset your password.</p>
      <p>Click the button below. This link expires in 1 hour.</p>
      <a href="${resetLink}" style="background: #FF5A5F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Reset Password
      </a>
      <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
    </div>
  `;
}