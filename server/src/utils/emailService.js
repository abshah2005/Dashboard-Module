import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendApplicationTrackingId = async (email, trackingId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Application Tracking ID',
    text: `Your Application tracking ID is ${trackingId}. You can check your application status using this Application ID anytime.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendInterviewDetails = async (email, interviewDate, googleMeetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Interview Details',
    text: `Your interview is scheduled on ${interviewDate}. Please join the interview using the following Google Meet link: ${googleMeetLink}.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendAssessmentDetails = async (email, assessmentDetails, assessmentLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Assessment Details',
    text: `Please complete the following assessment: ${assessmentDetails}. You can access the assessment using the following link: ${assessmentLink}.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendOfferLetter = async (email, offerLetterLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Offer Letter',
    text: `Congratulations! You have been offered a position. Please review your offer letter using the following link: ${offerLetterLink}.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendRejectionNotification = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Application Status',
    text: `We regret to inform you that your application has been rejected. Thank you for your interest in our company.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};