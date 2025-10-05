# Formspree Setup Guide

This guide explains how to configure Formspree for the contact form in your portfolio website.

## What is Formspree?

Formspree is a form backend service that allows you to receive form submissions without setting up a server. It's perfect for static sites like this portfolio.

## Step-by-Step Setup

### 1. Create a Formspree Account

1. Go to [https://formspree.io](https://formspree.io)
2. Click "Sign Up" and create an account
3. Verify your email address

### 2. Create a New Form

1. After logging in, click "New Form"
2. Give your form a name (e.g., "Portfolio Contact Form")
3. Enter your email address where you want to receive submissions
4. Click "Create Form"

### 3. Get Your Form ID

1. After creating the form, you'll be taken to the form's dashboard
2. Click on the "Integration" tab
3. Copy the Form ID (it looks like: `xqkvzvaj`)

### 4. Configure Your Portfolio

1. Open the file `config/contact-config.js`
2. Replace `YOUR_FORMSPREE_ID` with your actual Form ID:

```javascript
formspree: {
  formId: 'your-actual-form-id-here', // Replace with your Form ID
  get endpoint() {
    return `https://formspree.io/f/${this.formId}`;
  }
}
```

### 5. Update Contact Information (Optional)

In the same file (`config/contact-config.js`), you can also update:

```javascript
contact: {
  email: 'your-email@example.com',
  location: 'Your City, State',
  availability: 'Open to opportunities',
  preferredContact: 'Email or LinkedIn'
},

social: {
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  twitter: 'https://twitter.com/yourusername'
},

resume: {
  url: 'path/to/your/resume.pdf',
  filename: 'resume.pdf'
}
```

### 6. Test Your Form

1. Open your portfolio website
2. Navigate to the Contact section
3. Fill out the form and submit it
4. Check your email (and Formspree dashboard) to confirm the submission was received

## Advanced Configuration

### Custom Redirect Pages

If you want to redirect users to a custom thank you page after submission:

1. In Formspree, go to your form's settings
2. Under "After submission", select "Redirect to URL"
3. Enter your thank you page URL

### Spam Protection

The form already includes:
- Honeypot field (invisible field that catches bots)
- Client-side validation

Formspree also includes built-in spam protection that you can configure in your form settings.

### Email Templates

You can customize the email notifications in Formspree:
1. Go to your form's settings
2. Click on "Emails"
3. Customize the template as needed

## Troubleshooting

### Form Not Submitting

1. Check that your Form ID is correctly entered in `config/contact-config.js`
2. Ensure the form endpoint URL is correct
3. Check browser console for any JavaScript errors

### Not Receiving Emails

1. Check your spam folder
2. Verify your email address in Formspree settings
3. Check Formspree's submission log to see if the form was submitted

### Form Validation Issues

1. Ensure all required fields are filled out
2. Check that email format is valid
3. Make sure privacy policy checkbox is checked

## Security Notes

- Never expose your Formspree API key in client-side code
- The honeypot field helps prevent basic bot submissions
- Consider adding reCAPTCHA if you receive a lot of spam
- Regularly check your Formspree dashboard for unusual activity

## Need Help?

- Formspree Documentation: [https://help.formspree.io](https://help.formspree.io)
- Contact Formspree Support: support@formspree.io
- Check your portfolio's browser console for specific error messages