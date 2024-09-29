import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const signin = async (req, res) => {
  const userData = req.body;
  console.log(userData);

  try {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const generateNumericOtp = (length) => {
      let otp = "";
      for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
      }
      return otp;
    };

    const otp = generateNumericOtp(4);
    console.log(otp);
    const otp1 = otp[0];
    const otp2 = otp[1];
    const otp3 = otp[2];
    const otp4 = otp[3];

    user.otp = otp;
    user.otpExpiry = Date.now() + 2 * 60 * 1000; // OTP valid for 2 minutes
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Sign-In",
      html: ` 
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>OTP Verification</title>
</head>
<body style="font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background-color: #ffffff; width: 100%;">

    <div style="width:95%; margin: 20px auto; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        
       

        <div style="text-align: center; padding: 20px 0; background-color: #18968F; border-radius: 10px 10px 0 0; margin-bottom: 20px;">
        <svg width="212" height="50" viewBox="0 0 212 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 25H55.5607" stroke="white" stroke-width="3" stroke-linecap="round"/>
        <path d="M83.3608 2H129.761C132.951 2 135.561 4.5875 135.561 7.75V42.25C135.561 45.4125 132.951 48 129.761 48H83.3608C80.1708 48 77.5608 45.4125 77.5608 42.25V7.75C77.5608 4.5875 80.1708 2 83.3608 2Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M153 25H206.561" stroke="white" stroke-width="3" stroke-linecap="round"/>
        <path d="M135.357 7L106.279 28L77.2012 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        </div>

        <div style="text-align: center; font-size: 32px; font-weight: 600; color: #000;">
            OTP for Verification
        </div>

        <br style="text-align: center; font-size: 18px; color: #333;">
            <span style="text-align: center;font-weight: 600;"><h3 style="text-align: center;font-weight: 500;">${user.fullname}</h3></span>
            <p style="font-size: 15px; text-align: center;">Thank you for choosing SwiftHR. Use the following OTP to complete your secure login. </p> 
            <p style="font-size: 15px;text-align: center;"> This OTP is validfor 5 minutes and should not be shared with anyone.</p>
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; width: 50px; height: 50px; background-color: #e0e0e0; text-align: center; line-height: 50px; font-size: 24px; font-weight: bold; color: #000; margin: 0 5px; border-radius: 5px;">
                ${otp1}
            </span>
            <span style="display: inline-block; width: 50px; height: 50px; background-color: #e0e0e0; text-align: center; line-height: 50px; font-size: 24px; font-weight: bold; color: #000; margin: 0 5px; border-radius: 5px;">
                ${otp2}
            </span>
            <span style="display: inline-block; width: 50px; height: 50px; background-color: #e0e0e0; text-align: center; line-height: 50px; font-size: 24px; font-weight: bold; color: #000; margin: 0 5px; border-radius: 5px;">
                ${otp3}
            </span>
            <span style="display: inline-block; width: 50px; height: 50px; background-color: #e0e0e0; text-align: center; line-height: 50px; font-size: 24px; font-weight: bold; color: #000; margin: 0 5px; border-radius: 5px;">
                ${otp4}
            </span>
        </div>

        <p style="text-align: center;">
            Need help? Contact us at <a href="mailto:hello@devlogix.com" style="color: #000;font-weight: 600;">hello@devlogix.com</a> or visit our <a href="https://devlogix.com.pk/" style="color: #000;font-weight: 600;">website</a>.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <div style="text-align: center; font-size: 14px; color: #999; margin-top: 0px;">
            <div style="display: flex; justify-items: center;justify-content: center;">
                <div style="display:flex;"><svg width="187" height="39" viewBox="0 0 187 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="39" height="39" rx="19.5" fill="#18968F"/>
                    <path d="M10.9464 11.4453C10.9543 11.4382 10.9622 11.4312 10.9702 11.4242L11.3 11.8C11.6342 11.4218 12.0472 11.1214 12.51 10.92C13.1805 10.678 13.8872 10.5516 14.6 10.546C15.0196 10.546 15.3383 10.5364 15.7327 10.5245C16.3722 10.5053 17.2105 10.48 19 10.48H19C21.893 10.48 22.3 10.48 23.4 10.546M10.9464 11.4453C11.3252 11.0234 11.7904 10.6879 12.3105 10.4615L12.3252 10.4551L12.3403 10.4497C13.064 10.1885 13.8267 10.052 14.5961 10.046L14.6 10.046C15.0114 10.046 15.321 10.0367 15.7133 10.0249C15.8367 10.0211 15.9683 10.0172 16.1139 10.0132C16.7196 9.99656 17.5492 9.98 19 9.98H19.0223C21.8812 9.98 22.3119 9.98 23.4181 10.0462M10.9464 11.4453C10.5223 11.8238 10.1884 12.2927 9.96953 12.8175L9.9659 12.8262L9.9626 12.8351C9.69393 13.5545 9.55299 14.3152 9.54612 15.083C9.48 16.1884 9.48 16.6198 9.48 19.4777V19.5C9.48 20.9508 9.49656 21.7804 9.51319 22.3861C9.51719 22.5317 9.52115 22.6633 9.52487 22.7867C9.53668 23.179 9.546 23.4886 9.546 23.9V23.9078L9.54625 23.9157C9.57047 24.6882 9.73033 25.4505 10.0185 26.1676C10.214 26.7122 10.5312 27.2049 10.9461 27.6083C11.335 28.0098 11.802 28.3275 12.3183 28.5418L12.334 28.5483L12.3501 28.5537C13.0853 28.8019 13.8576 28.9225 14.6334 28.9103C15.734 28.976 16.1692 28.976 19.0214 28.976H19.044C21.9301 28.976 22.3534 28.9651 23.4595 28.9098C24.211 28.9001 24.9555 28.7635 25.6615 28.5057L25.6615 28.5057L25.6666 28.5038C26.2089 28.299 26.7003 27.9792 27.1069 27.5662C27.5263 27.1609 27.8485 26.6658 28.0494 26.1182L28.0497 26.1175C28.3075 25.4115 28.4441 24.667 28.4538 23.9155C28.5091 22.8094 28.52 22.3861 28.52 19.5C28.52 16.6155 28.5091 16.1911 28.4539 15.0863C28.4494 14.3194 28.3126 13.559 28.0497 12.8386L28.0472 12.8317L28.0445 12.8249C27.8368 12.3036 27.5181 11.8338 27.1106 11.4481C26.6988 11.0036 26.1882 10.6621 25.62 10.4512L25.6175 10.4503C24.9123 10.1928 24.1687 10.0562 23.4181 10.0462M10.9464 11.4453L23.4 10.546M23.4181 10.0462C23.414 10.0461 23.4098 10.0461 23.4057 10.046L23.4 10.546M23.4181 10.0462C23.422 10.0464 23.426 10.0467 23.4299 10.0469L23.4 10.546M24.0698 13.786L23.5794 13.8835L24.0698 13.786C24.0381 13.6269 24.0544 13.462 24.1164 13.3122C24.1785 13.1624 24.2836 13.0343 24.4184 12.9442C24.5533 12.8541 24.7118 12.806 24.874 12.806C25.0915 12.806 25.3 12.8924 25.4538 13.0462L25.8074 12.6926L25.4538 13.0462C25.6076 13.2 25.694 13.4085 25.694 13.626C25.694 13.7882 25.6459 13.9467 25.5558 14.0816C25.4657 14.2164 25.3376 14.3215 25.1878 14.3836C25.038 14.4456 24.8731 14.4619 24.714 14.4302C24.555 14.3986 24.4089 14.3205 24.2942 14.2058C24.1795 14.0911 24.1014 13.945 24.0698 13.786ZM29.4341 14.9797L29.4343 14.988L29.4348 14.9963C29.4999 16.1456 29.5 16.505 29.5 19.5C29.5 20.9918 29.4836 21.8288 29.4672 22.4373C29.4634 22.5764 29.4597 22.7045 29.4561 22.8264C29.4441 23.2341 29.4341 23.5729 29.434 24.026C29.4133 24.8813 29.253 25.7274 28.9593 26.5309C28.7083 27.1962 28.3138 27.798 27.8037 28.2933L27.7979 28.2989L27.7924 28.3046C27.3004 28.8139 26.699 29.2046 26.0337 29.4473L26.0337 29.4472L26.0282 29.4493C25.2264 29.7524 24.3787 29.9164 23.5216 29.9341L23.5127 29.9343L23.5037 29.9348C22.3544 29.9999 21.995 30 19 30C16.005 30 15.6456 29.9999 14.4963 29.9348L14.4873 29.9343L14.4784 29.9341C13.6213 29.9164 12.7736 29.7524 11.9718 29.4493L11.9681 29.4479C11.3029 29.2024 10.7009 28.8113 10.2063 28.3032L10.2009 28.2977L10.1954 28.2924C9.6861 27.8004 9.29536 27.199 9.05274 26.5337L9.05277 26.5337L9.0507 26.5282C8.7476 25.7264 8.58364 24.8787 8.56589 24.0216L8.56571 24.0127L8.5652 24.0037C8.50015 22.8544 8.5 22.495 8.5 19.5C8.5 16.505 8.50015 16.1456 8.5652 14.9963L8.56571 14.9873L8.56589 14.9784C8.58364 14.1213 8.7476 13.2736 9.0507 12.4718L9.05073 12.4718L9.05274 12.4663C9.29536 11.801 9.6861 11.1996 10.1954 10.7076L10.2009 10.7023L10.2063 10.6968C10.7009 10.1887 11.3029 9.79759 11.9681 9.55207L11.9681 9.55209L11.9718 9.5507C12.7736 9.2476 13.6213 9.08364 14.4784 9.06589L14.4873 9.06571L14.4963 9.0652C15.6456 9.00015 16.005 9 19 9C21.995 9 22.3544 9.00015 23.5037 9.0652L23.5127 9.06571L23.5216 9.06589C24.3787 9.08364 25.2264 9.2476 26.0282 9.5507L26.0282 9.55073L26.0337 9.55274C26.699 9.79536 27.3004 10.1861 27.7924 10.6954L27.7923 10.6955L27.8022 10.7053C28.3108 11.2032 28.7056 11.8052 28.9596 12.47C29.2538 13.2751 29.4141 14.1228 29.4341 14.9797ZM19.001 14.357L19.002 14.357C19.6784 14.3544 20.3487 14.4855 20.9744 14.7428C21.6 15.0002 22.1685 15.3787 22.6473 15.8566C23.1262 16.3344 23.5058 16.9023 23.7643 17.5274C24.0229 18.1525 24.1553 18.8225 24.154 19.499V19.5C24.154 20.5168 23.8526 21.5107 23.2879 22.3563C22.7233 23.2018 21.9206 23.861 20.9815 24.2505C20.0423 24.6401 19.0087 24.7425 18.0113 24.5449C17.014 24.3473 16.0976 23.8584 15.3779 23.1402C14.6582 22.4219 14.1676 21.5065 13.968 20.5095C13.7685 19.5125 13.8689 18.4787 14.2566 17.5388C14.6443 16.5989 15.302 15.7949 16.1464 15.2286C16.9909 14.6623 17.9842 14.359 19.001 14.357ZM16.6872 22.9614C17.3718 23.4188 18.1766 23.663 19 23.663C19.5467 23.663 20.088 23.5553 20.5931 23.3461C21.0982 23.1369 21.5571 22.8303 21.9437 22.4437C22.3303 22.0571 22.6369 21.5982 22.8461 21.0931C23.0553 20.588 23.163 20.0467 23.163 19.5C23.163 18.6766 22.9188 17.8718 22.4614 17.1872C22.004 16.5026 21.3538 15.969 20.5931 15.6539C19.8324 15.3388 18.9954 15.2564 18.1878 15.417C17.3803 15.5776 16.6385 15.9741 16.0563 16.5563C15.4741 17.1385 15.0776 17.8803 14.917 18.6878C14.7564 19.4954 14.8388 20.3324 15.1539 21.0931C15.469 21.8538 16.0026 22.504 16.6872 22.9614Z" fill="white" stroke="white"/>
                    <rect x="49.5" y="0.5" width="38" height="38" rx="19" fill="#18968F"/>
                    <rect x="49.5" y="0.5" width="38" height="38" rx="19" stroke="white"/>
                    <path d="M74 8.5H70.7273C69.2806 8.5 67.8933 9.07946 66.8703 10.1109C65.8474 11.1424 65.2727 12.5413 65.2727 14V17.3H62V21.7H65.2727V30.5H69.6364V21.7H72.9091L74 17.3H69.6364V14C69.6364 13.7083 69.7513 13.4285 69.9559 13.2222C70.1605 13.0159 70.4379 12.9 70.7273 12.9H74V8.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="98.5" y="0.5" width="38" height="38" rx="19" fill="#18968F"/>
                    <rect x="98.5" y="0.5" width="38" height="38" rx="19" stroke="white"/>
                    <path d="M127.539 13.5045C127.421 13.0134 127.179 12.5633 126.838 12.1999C126.498 11.8365 126.07 11.5725 125.6 11.4347C123.88 11 117 11 117 11C117 11 110.12 11 108.4 11.4761C107.93 11.6139 107.502 11.8779 107.162 12.2413C106.821 12.6047 106.579 13.0548 106.461 13.5459C106.146 15.3525 105.992 17.1851 106.001 19.0207C105.989 20.8702 106.143 22.7167 106.461 24.5369C106.592 25.0128 106.839 25.4457 107.179 25.7938C107.518 26.1419 107.939 26.3933 108.4 26.5239C110.12 27 117 27 117 27C117 27 123.88 27 125.6 26.5239C126.07 26.3861 126.498 26.1221 126.838 25.7587C127.179 25.3953 127.421 24.9452 127.539 24.4541C127.852 22.6612 128.006 20.8425 127.999 19.0207C128.011 17.1712 127.857 15.3247 127.539 13.5045Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M116 23L121 19.5L116 16V23Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="167.5" cy="19.5" r="19" fill="#18968F" stroke="white"/>
                    <path d="M180 10.0101C178.955 10.6877 177.799 11.2059 176.575 11.5449C175.918 10.8502 175.044 10.3579 174.073 10.1344C173.102 9.91094 172.079 9.96715 171.144 10.2954C170.209 10.6237 169.406 11.2082 168.843 11.9699C168.281 12.7316 167.987 13.6338 168 14.5543V15.5574C166.083 15.6032 164.183 15.2122 162.47 14.4193C160.757 13.6265 159.284 12.4564 158.182 11.0132C158.182 11.0132 153.818 20.0415 163.636 24.054C161.39 25.4564 158.713 26.1595 156 26.0603C165.818 31.076 177.818 26.0603 177.818 14.5242C177.817 14.2448 177.788 13.9661 177.731 13.6916C178.844 12.6819 179.63 11.4072 180 10.0101Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </div>
            </div>
            
            <p>You are receiving this email because you registered on the SwiftHR platform.</p>
            <p>© 2024 SwiftHR. All rights reserved.</p>
        </div>

    </div>

</body>
</html>
        `
      };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Email sent: " + info.response);
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });
    const generateNumericOtp = (length) => {
      let otp = "";
      for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
      }
      return otp;
    };

    const otp = generateNumericOtp(4);
    console.log(otp);
    const otp1 = otp[0];
    const otp2 = otp[1];
    const otp3 = otp[2];
    const otp4 = otp[3];

    user.otp = otp;
    user.otpExpiry = Date.now() + 2 * 60 * 1000; // OTP valid for 5 minutes
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Sign-In",
      html: `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>OTP Verification</title>
</head>
<body style="font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background-color: #ffffff; width: 100%;">

    <div style="width:95%; margin: 20px auto; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        
       

        <div style="text-align: center; padding: 20px 0; background-color: #18968F; border-radius: 10px 10px 0 0; margin-bottom: 20px;">
        <svg width="212" height="50" viewBox="0 0 212 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 25H55.5607" stroke="white" stroke-width="3" stroke-linecap="round"/>
        <path d="M83.3608 2H129.761C132.951 2 135.561 4.5875 135.561 7.75V42.25C135.561 45.4125 132.951 48 129.761 48H83.3608C80.1708 48 77.5608 45.4125 77.5608 42.25V7.75C77.5608 4.5875 80.1708 2 83.3608 2Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M153 25H206.561" stroke="white" stroke-width="3" stroke-linecap="round"/>
        <path d="M135.357 7L106.279 28L77.2012 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        </div>

        <div style="text-align: center; font-size: 32px; font-weight: 600; color: #000;">
            OTP for Verification
        </div>

        <br style="text-align: center; font-size: 18px; color: #333;">
            <span style="text-align: center;font-weight: 600;"><h3 style="text-align: center;font-weight: 500;">${user.fullname}</h3></span>
            <p style="font-size: 15px; text-align: center;">Thank you for choosing SwiftHR. Use the following OTP to complete your secure login. </p> 
            <p style="font-size: 15px;text-align: center;"> This OTP is validfor 5 minutes and should not be shared with anyone.</p>
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; width: 50px; height: 50px; background-color: #e0e0e0; text-align: center; line-height: 50px; font-size: 24px; font-weight: bold; color: #000; margin: 0 5px; border-radius: 5px;">
                ${otp1}
            </span>
            <span style="display: inline-block; width: 50px; height: 50px; background-color: #e0e0e0; text-align: center; line-height: 50px; font-size: 24px; font-weight: bold; color: #000; margin: 0 5px; border-radius: 5px;">
                ${otp2}
            </span>
            <span style="display: inline-block; width: 50px; height: 50px; background-color: #e0e0e0; text-align: center; line-height: 50px; font-size: 24px; font-weight: bold; color: #000; margin: 0 5px; border-radius: 5px;">
                ${otp3}
            </span>
            <span style="display: inline-block; width: 50px; height: 50px; background-color: #e0e0e0; text-align: center; line-height: 50px; font-size: 24px; font-weight: bold; color: #000; margin: 0 5px; border-radius: 5px;">
                ${otp4}
            </span>
        </div>

        <p style="text-align: center;">
            Need help? Contact us at <a href="mailto:hello@devlogix.com" style="color: #000;font-weight: 600;">hello@devlogix.com</a> or visit our <a href="https://devlogix.com.pk/" style="color: #000;font-weight: 600;">website</a>.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <div style="text-align: center; font-size: 14px; color: #999; margin-top: 0px;">
            <div style="display: flex; justify-items: center;justify-content: center;">
                <div style="display:flex;"><svg width="187" height="39" viewBox="0 0 187 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="39" height="39" rx="19.5" fill="#18968F"/>
                    <path d="M10.9464 11.4453C10.9543 11.4382 10.9622 11.4312 10.9702 11.4242L11.3 11.8C11.6342 11.4218 12.0472 11.1214 12.51 10.92C13.1805 10.678 13.8872 10.5516 14.6 10.546C15.0196 10.546 15.3383 10.5364 15.7327 10.5245C16.3722 10.5053 17.2105 10.48 19 10.48H19C21.893 10.48 22.3 10.48 23.4 10.546M10.9464 11.4453C11.3252 11.0234 11.7904 10.6879 12.3105 10.4615L12.3252 10.4551L12.3403 10.4497C13.064 10.1885 13.8267 10.052 14.5961 10.046L14.6 10.046C15.0114 10.046 15.321 10.0367 15.7133 10.0249C15.8367 10.0211 15.9683 10.0172 16.1139 10.0132C16.7196 9.99656 17.5492 9.98 19 9.98H19.0223C21.8812 9.98 22.3119 9.98 23.4181 10.0462M10.9464 11.4453C10.5223 11.8238 10.1884 12.2927 9.96953 12.8175L9.9659 12.8262L9.9626 12.8351C9.69393 13.5545 9.55299 14.3152 9.54612 15.083C9.48 16.1884 9.48 16.6198 9.48 19.4777V19.5C9.48 20.9508 9.49656 21.7804 9.51319 22.3861C9.51719 22.5317 9.52115 22.6633 9.52487 22.7867C9.53668 23.179 9.546 23.4886 9.546 23.9V23.9078L9.54625 23.9157C9.57047 24.6882 9.73033 25.4505 10.0185 26.1676C10.214 26.7122 10.5312 27.2049 10.9461 27.6083C11.335 28.0098 11.802 28.3275 12.3183 28.5418L12.334 28.5483L12.3501 28.5537C13.0853 28.8019 13.8576 28.9225 14.6334 28.9103C15.734 28.976 16.1692 28.976 19.0214 28.976H19.044C21.9301 28.976 22.3534 28.9651 23.4595 28.9098C24.211 28.9001 24.9555 28.7635 25.6615 28.5057L25.6615 28.5057L25.6666 28.5038C26.2089 28.299 26.7003 27.9792 27.1069 27.5662C27.5263 27.1609 27.8485 26.6658 28.0494 26.1182L28.0497 26.1175C28.3075 25.4115 28.4441 24.667 28.4538 23.9155C28.5091 22.8094 28.52 22.3861 28.52 19.5C28.52 16.6155 28.5091 16.1911 28.4539 15.0863C28.4494 14.3194 28.3126 13.559 28.0497 12.8386L28.0472 12.8317L28.0445 12.8249C27.8368 12.3036 27.5181 11.8338 27.1106 11.4481C26.6988 11.0036 26.1882 10.6621 25.62 10.4512L25.6175 10.4503C24.9123 10.1928 24.1687 10.0562 23.4181 10.0462M10.9464 11.4453L23.4 10.546M23.4181 10.0462C23.414 10.0461 23.4098 10.0461 23.4057 10.046L23.4 10.546M23.4181 10.0462C23.422 10.0464 23.426 10.0467 23.4299 10.0469L23.4 10.546M24.0698 13.786L23.5794 13.8835L24.0698 13.786C24.0381 13.6269 24.0544 13.462 24.1164 13.3122C24.1785 13.1624 24.2836 13.0343 24.4184 12.9442C24.5533 12.8541 24.7118 12.806 24.874 12.806C25.0915 12.806 25.3 12.8924 25.4538 13.0462L25.8074 12.6926L25.4538 13.0462C25.6076 13.2 25.694 13.4085 25.694 13.626C25.694 13.7882 25.6459 13.9467 25.5558 14.0816C25.4657 14.2164 25.3376 14.3215 25.1878 14.3836C25.038 14.4456 24.8731 14.4619 24.714 14.4302C24.555 14.3986 24.4089 14.3205 24.2942 14.2058C24.1795 14.0911 24.1014 13.945 24.0698 13.786ZM29.4341 14.9797L29.4343 14.988L29.4348 14.9963C29.4999 16.1456 29.5 16.505 29.5 19.5C29.5 20.9918 29.4836 21.8288 29.4672 22.4373C29.4634 22.5764 29.4597 22.7045 29.4561 22.8264C29.4441 23.2341 29.4341 23.5729 29.434 24.026C29.4133 24.8813 29.253 25.7274 28.9593 26.5309C28.7083 27.1962 28.3138 27.798 27.8037 28.2933L27.7979 28.2989L27.7924 28.3046C27.3004 28.8139 26.699 29.2046 26.0337 29.4473L26.0337 29.4472L26.0282 29.4493C25.2264 29.7524 24.3787 29.9164 23.5216 29.9341L23.5127 29.9343L23.5037 29.9348C22.3544 29.9999 21.995 30 19 30C16.005 30 15.6456 29.9999 14.4963 29.9348L14.4873 29.9343L14.4784 29.9341C13.6213 29.9164 12.7736 29.7524 11.9718 29.4493L11.9681 29.4479C11.3029 29.2024 10.7009 28.8113 10.2063 28.3032L10.2009 28.2977L10.1954 28.2924C9.6861 27.8004 9.29536 27.199 9.05274 26.5337L9.05277 26.5337L9.0507 26.5282C8.7476 25.7264 8.58364 24.8787 8.56589 24.0216L8.56571 24.0127L8.5652 24.0037C8.50015 22.8544 8.5 22.495 8.5 19.5C8.5 16.505 8.50015 16.1456 8.5652 14.9963L8.56571 14.9873L8.56589 14.9784C8.58364 14.1213 8.7476 13.2736 9.0507 12.4718L9.05073 12.4718L9.05274 12.4663C9.29536 11.801 9.6861 11.1996 10.1954 10.7076L10.2009 10.7023L10.2063 10.6968C10.7009 10.1887 11.3029 9.79759 11.9681 9.55207L11.9681 9.55209L11.9718 9.5507C12.7736 9.2476 13.6213 9.08364 14.4784 9.06589L14.4873 9.06571L14.4963 9.0652C15.6456 9.00015 16.005 9 19 9C21.995 9 22.3544 9.00015 23.5037 9.0652L23.5127 9.06571L23.5216 9.06589C24.3787 9.08364 25.2264 9.2476 26.0282 9.5507L26.0282 9.55073L26.0337 9.55274C26.699 9.79536 27.3004 10.1861 27.7924 10.6954L27.7923 10.6955L27.8022 10.7053C28.3108 11.2032 28.7056 11.8052 28.9596 12.47C29.2538 13.2751 29.4141 14.1228 29.4341 14.9797ZM19.001 14.357L19.002 14.357C19.6784 14.3544 20.3487 14.4855 20.9744 14.7428C21.6 15.0002 22.1685 15.3787 22.6473 15.8566C23.1262 16.3344 23.5058 16.9023 23.7643 17.5274C24.0229 18.1525 24.1553 18.8225 24.154 19.499V19.5C24.154 20.5168 23.8526 21.5107 23.2879 22.3563C22.7233 23.2018 21.9206 23.861 20.9815 24.2505C20.0423 24.6401 19.0087 24.7425 18.0113 24.5449C17.014 24.3473 16.0976 23.8584 15.3779 23.1402C14.6582 22.4219 14.1676 21.5065 13.968 20.5095C13.7685 19.5125 13.8689 18.4787 14.2566 17.5388C14.6443 16.5989 15.302 15.7949 16.1464 15.2286C16.9909 14.6623 17.9842 14.359 19.001 14.357ZM16.6872 22.9614C17.3718 23.4188 18.1766 23.663 19 23.663C19.5467 23.663 20.088 23.5553 20.5931 23.3461C21.0982 23.1369 21.5571 22.8303 21.9437 22.4437C22.3303 22.0571 22.6369 21.5982 22.8461 21.0931C23.0553 20.588 23.163 20.0467 23.163 19.5C23.163 18.6766 22.9188 17.8718 22.4614 17.1872C22.004 16.5026 21.3538 15.969 20.5931 15.6539C19.8324 15.3388 18.9954 15.2564 18.1878 15.417C17.3803 15.5776 16.6385 15.9741 16.0563 16.5563C15.4741 17.1385 15.0776 17.8803 14.917 18.6878C14.7564 19.4954 14.8388 20.3324 15.1539 21.0931C15.469 21.8538 16.0026 22.504 16.6872 22.9614Z" fill="white" stroke="white"/>
                    <rect x="49.5" y="0.5" width="38" height="38" rx="19" fill="#18968F"/>
                    <rect x="49.5" y="0.5" width="38" height="38" rx="19" stroke="white"/>
                    <path d="M74 8.5H70.7273C69.2806 8.5 67.8933 9.07946 66.8703 10.1109C65.8474 11.1424 65.2727 12.5413 65.2727 14V17.3H62V21.7H65.2727V30.5H69.6364V21.7H72.9091L74 17.3H69.6364V14C69.6364 13.7083 69.7513 13.4285 69.9559 13.2222C70.1605 13.0159 70.4379 12.9 70.7273 12.9H74V8.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="98.5" y="0.5" width="38" height="38" rx="19" fill="#18968F"/>
                    <rect x="98.5" y="0.5" width="38" height="38" rx="19" stroke="white"/>
                    <path d="M127.539 13.5045C127.421 13.0134 127.179 12.5633 126.838 12.1999C126.498 11.8365 126.07 11.5725 125.6 11.4347C123.88 11 117 11 117 11C117 11 110.12 11 108.4 11.4761C107.93 11.6139 107.502 11.8779 107.162 12.2413C106.821 12.6047 106.579 13.0548 106.461 13.5459C106.146 15.3525 105.992 17.1851 106.001 19.0207C105.989 20.8702 106.143 22.7167 106.461 24.5369C106.592 25.0128 106.839 25.4457 107.179 25.7938C107.518 26.1419 107.939 26.3933 108.4 26.5239C110.12 27 117 27 117 27C117 27 123.88 27 125.6 26.5239C126.07 26.3861 126.498 26.1221 126.838 25.7587C127.179 25.3953 127.421 24.9452 127.539 24.4541C127.852 22.6612 128.006 20.8425 127.999 19.0207C128.011 17.1712 127.857 15.3247 127.539 13.5045Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M116 23L121 19.5L116 16V23Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="167.5" cy="19.5" r="19" fill="#18968F" stroke="white"/>
                    <path d="M180 10.0101C178.955 10.6877 177.799 11.2059 176.575 11.5449C175.918 10.8502 175.044 10.3579 174.073 10.1344C173.102 9.91094 172.079 9.96715 171.144 10.2954C170.209 10.6237 169.406 11.2082 168.843 11.9699C168.281 12.7316 167.987 13.6338 168 14.5543V15.5574C166.083 15.6032 164.183 15.2122 162.47 14.4193C160.757 13.6265 159.284 12.4564 158.182 11.0132C158.182 11.0132 153.818 20.0415 163.636 24.054C161.39 25.4564 158.713 26.1595 156 26.0603C165.818 31.076 177.818 26.0603 177.818 14.5242C177.817 14.2448 177.788 13.9661 177.731 13.6916C178.844 12.6819 179.63 11.4072 180 10.0101Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </div>
            </div>
            
            <p>You are receiving this email because you registered on the SwiftHR platform.</p>
            <p>© 2024 SwiftHR. All rights reserved.</p>
        </div>

    </div>

</body>
</html>
  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Email sent again: " + info.response);
    });

    res.status(200).json({ message: "OTP sent to Your Email Again." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const verifySignInOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(401).json({ message: "Invalid OTP" });

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Sign In successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 30 * 60 * 1000;

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: "Password Reset Request",
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Password Reset Email</title>
    </head>

    <body style="font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background-color: #ffffff; width: 100%;">
        <div style="width:95%; margin: 20px auto; background-color:#ffffff;padding:20px">
            <!-- Header -->
            <!-- Icon Section -->
            <div style="text-align: center; padding: 20px 0; background-color: #18968F; border-radius: 10px 10px 0 0; margin-bottom: 20px;">
              <svg width="212" height="50" viewBox="0 0 212 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 25H55.5607" stroke="white" stroke-width="3" stroke-linecap="round"/>
              <path d="M83.3608 2H129.761C132.951 2 135.561 4.5875 135.561 7.75V42.25C135.561 45.4125 132.951 48 129.761 48H83.3608C80.1708 48 77.5608 45.4125 77.5608 42.25V7.75C77.5608 4.5875 80.1708 2 83.3608 2Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M153 25H206.561" stroke="white" stroke-width="3" stroke-linecap="round"/>
              <path d="M135.357 7L106.279 28L77.2012 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              
              </div>

            <!-- Body Content -->
            <div  style= "text-align: center;
            padding: 20px;">
                <h2 style="font-size: 24px; font-weight: 600; color: #000;">Password Reset Link</h2>
                <br style="text-align: center; font-size: 18px; color: #333;">
                <span style="text-align: center;font-weight: 600;"><h3 style="text-align: center;font-weight: 500;">${user.fullname}</h3></span>
                <p style="font-size: 15px; text-align: center;">Thank you for choosing SwiftHR. Use the following link to reset your account password. </p> 
                <p style="font-size: 15px;text-align: center;"> If you didn’t request a password reset, ignore this message. This link is valid only for 1 hour. Do not share this link with others.
            </p>


                <!-- Reset Button -->
                <div style="text-align: center; margin: 20px 0;">
                    <div style="display: inline-block; background-color: #18968F; border-radius: 10px; width: 300px;">
                        <a href="${resetLink}" style="display: inline-block; font-size: 16px; font-weight: 500;  padding: 10px 0; width: 100%; text-align: center; border-radius: 10px; text-decoration: none;  
                        color: #18968F;">
                           <span style="color:#ffffff">Reset Password</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Contact Information -->
            <div style="text-align: center;
            padding: 20px;">
                <p style="font-size: 14px; color: gray; ">
                    Need help? Ask at <a href="mailto:hello@devlogix.com" style="font-weight: 600; color: #000;">hello@devlogix.com</a> or visit our <a href="https://devlogix.com.pk" style="font-weight: 600; color: #000;">website</a>
                </p>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      
              <div style="text-align: center; font-size: 14px; color: #999; margin-top: 0px;">
                  <div style="display: flex; justify-items: center;justify-content: center;">
                      <div style="display:flex;"><svg width="187" height="39" viewBox="0 0 187 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="39" height="39" rx="19.5" fill="#18968F"/>
                          <path d="M10.9464 11.4453C10.9543 11.4382 10.9622 11.4312 10.9702 11.4242L11.3 11.8C11.6342 11.4218 12.0472 11.1214 12.51 10.92C13.1805 10.678 13.8872 10.5516 14.6 10.546C15.0196 10.546 15.3383 10.5364 15.7327 10.5245C16.3722 10.5053 17.2105 10.48 19 10.48H19C21.893 10.48 22.3 10.48 23.4 10.546M10.9464 11.4453C11.3252 11.0234 11.7904 10.6879 12.3105 10.4615L12.3252 10.4551L12.3403 10.4497C13.064 10.1885 13.8267 10.052 14.5961 10.046L14.6 10.046C15.0114 10.046 15.321 10.0367 15.7133 10.0249C15.8367 10.0211 15.9683 10.0172 16.1139 10.0132C16.7196 9.99656 17.5492 9.98 19 9.98H19.0223C21.8812 9.98 22.3119 9.98 23.4181 10.0462M10.9464 11.4453C10.5223 11.8238 10.1884 12.2927 9.96953 12.8175L9.9659 12.8262L9.9626 12.8351C9.69393 13.5545 9.55299 14.3152 9.54612 15.083C9.48 16.1884 9.48 16.6198 9.48 19.4777V19.5C9.48 20.9508 9.49656 21.7804 9.51319 22.3861C9.51719 22.5317 9.52115 22.6633 9.52487 22.7867C9.53668 23.179 9.546 23.4886 9.546 23.9V23.9078L9.54625 23.9157C9.57047 24.6882 9.73033 25.4505 10.0185 26.1676C10.214 26.7122 10.5312 27.2049 10.9461 27.6083C11.335 28.0098 11.802 28.3275 12.3183 28.5418L12.334 28.5483L12.3501 28.5537C13.0853 28.8019 13.8576 28.9225 14.6334 28.9103C15.734 28.976 16.1692 28.976 19.0214 28.976H19.044C21.9301 28.976 22.3534 28.9651 23.4595 28.9098C24.211 28.9001 24.9555 28.7635 25.6615 28.5057L25.6615 28.5057L25.6666 28.5038C26.2089 28.299 26.7003 27.9792 27.1069 27.5662C27.5263 27.1609 27.8485 26.6658 28.0494 26.1182L28.0497 26.1175C28.3075 25.4115 28.4441 24.667 28.4538 23.9155C28.5091 22.8094 28.52 22.3861 28.52 19.5C28.52 16.6155 28.5091 16.1911 28.4539 15.0863C28.4494 14.3194 28.3126 13.559 28.0497 12.8386L28.0472 12.8317L28.0445 12.8249C27.8368 12.3036 27.5181 11.8338 27.1106 11.4481C26.6988 11.0036 26.1882 10.6621 25.62 10.4512L25.6175 10.4503C24.9123 10.1928 24.1687 10.0562 23.4181 10.0462M10.9464 11.4453L23.4 10.546M23.4181 10.0462C23.414 10.0461 23.4098 10.0461 23.4057 10.046L23.4 10.546M23.4181 10.0462C23.422 10.0464 23.426 10.0467 23.4299 10.0469L23.4 10.546M24.0698 13.786L23.5794 13.8835L24.0698 13.786C24.0381 13.6269 24.0544 13.462 24.1164 13.3122C24.1785 13.1624 24.2836 13.0343 24.4184 12.9442C24.5533 12.8541 24.7118 12.806 24.874 12.806C25.0915 12.806 25.3 12.8924 25.4538 13.0462L25.8074 12.6926L25.4538 13.0462C25.6076 13.2 25.694 13.4085 25.694 13.626C25.694 13.7882 25.6459 13.9467 25.5558 14.0816C25.4657 14.2164 25.3376 14.3215 25.1878 14.3836C25.038 14.4456 24.8731 14.4619 24.714 14.4302C24.555 14.3986 24.4089 14.3205 24.2942 14.2058C24.1795 14.0911 24.1014 13.945 24.0698 13.786ZM29.4341 14.9797L29.4343 14.988L29.4348 14.9963C29.4999 16.1456 29.5 16.505 29.5 19.5C29.5 20.9918 29.4836 21.8288 29.4672 22.4373C29.4634 22.5764 29.4597 22.7045 29.4561 22.8264C29.4441 23.2341 29.4341 23.5729 29.434 24.026C29.4133 24.8813 29.253 25.7274 28.9593 26.5309C28.7083 27.1962 28.3138 27.798 27.8037 28.2933L27.7979 28.2989L27.7924 28.3046C27.3004 28.8139 26.699 29.2046 26.0337 29.4473L26.0337 29.4472L26.0282 29.4493C25.2264 29.7524 24.3787 29.9164 23.5216 29.9341L23.5127 29.9343L23.5037 29.9348C22.3544 29.9999 21.995 30 19 30C16.005 30 15.6456 29.9999 14.4963 29.9348L14.4873 29.9343L14.4784 29.9341C13.6213 29.9164 12.7736 29.7524 11.9718 29.4493L11.9681 29.4479C11.3029 29.2024 10.7009 28.8113 10.2063 28.3032L10.2009 28.2977L10.1954 28.2924C9.6861 27.8004 9.29536 27.199 9.05274 26.5337L9.05277 26.5337L9.0507 26.5282C8.7476 25.7264 8.58364 24.8787 8.56589 24.0216L8.56571 24.0127L8.5652 24.0037C8.50015 22.8544 8.5 22.495 8.5 19.5C8.5 16.505 8.50015 16.1456 8.5652 14.9963L8.56571 14.9873L8.56589 14.9784C8.58364 14.1213 8.7476 13.2736 9.0507 12.4718L9.05073 12.4718L9.05274 12.4663C9.29536 11.801 9.6861 11.1996 10.1954 10.7076L10.2009 10.7023L10.2063 10.6968C10.7009 10.1887 11.3029 9.79759 11.9681 9.55207L11.9681 9.55209L11.9718 9.5507C12.7736 9.2476 13.6213 9.08364 14.4784 9.06589L14.4873 9.06571L14.4963 9.0652C15.6456 9.00015 16.005 9 19 9C21.995 9 22.3544 9.00015 23.5037 9.0652L23.5127 9.06571L23.5216 9.06589C24.3787 9.08364 25.2264 9.2476 26.0282 9.5507L26.0282 9.55073L26.0337 9.55274C26.699 9.79536 27.3004 10.1861 27.7924 10.6954L27.7923 10.6955L27.8022 10.7053C28.3108 11.2032 28.7056 11.8052 28.9596 12.47C29.2538 13.2751 29.4141 14.1228 29.4341 14.9797ZM19.001 14.357L19.002 14.357C19.6784 14.3544 20.3487 14.4855 20.9744 14.7428C21.6 15.0002 22.1685 15.3787 22.6473 15.8566C23.1262 16.3344 23.5058 16.9023 23.7643 17.5274C24.0229 18.1525 24.1553 18.8225 24.154 19.499V19.5C24.154 20.5168 23.8526 21.5107 23.2879 22.3563C22.7233 23.2018 21.9206 23.861 20.9815 24.2505C20.0423 24.6401 19.0087 24.7425 18.0113 24.5449C17.014 24.3473 16.0976 23.8584 15.3779 23.1402C14.6582 22.4219 14.1676 21.5065 13.968 20.5095C13.7685 19.5125 13.8689 18.4787 14.2566 17.5388C14.6443 16.5989 15.302 15.7949 16.1464 15.2286C16.9909 14.6623 17.9842 14.359 19.001 14.357ZM16.6872 22.9614C17.3718 23.4188 18.1766 23.663 19 23.663C19.5467 23.663 20.088 23.5553 20.5931 23.3461C21.0982 23.1369 21.5571 22.8303 21.9437 22.4437C22.3303 22.0571 22.6369 21.5982 22.8461 21.0931C23.0553 20.588 23.163 20.0467 23.163 19.5C23.163 18.6766 22.9188 17.8718 22.4614 17.1872C22.004 16.5026 21.3538 15.969 20.5931 15.6539C19.8324 15.3388 18.9954 15.2564 18.1878 15.417C17.3803 15.5776 16.6385 15.9741 16.0563 16.5563C15.4741 17.1385 15.0776 17.8803 14.917 18.6878C14.7564 19.4954 14.8388 20.3324 15.1539 21.0931C15.469 21.8538 16.0026 22.504 16.6872 22.9614Z" fill="white" stroke="white"/>
                          <rect x="49.5" y="0.5" width="38" height="38" rx="19" fill="#18968F"/>
                          <rect x="49.5" y="0.5" width="38" height="38" rx="19" stroke="white"/>
                          <path d="M74 8.5H70.7273C69.2806 8.5 67.8933 9.07946 66.8703 10.1109C65.8474 11.1424 65.2727 12.5413 65.2727 14V17.3H62V21.7H65.2727V30.5H69.6364V21.7H72.9091L74 17.3H69.6364V14C69.6364 13.7083 69.7513 13.4285 69.9559 13.2222C70.1605 13.0159 70.4379 12.9 70.7273 12.9H74V8.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <rect x="98.5" y="0.5" width="38" height="38" rx="19" fill="#18968F"/>
                          <rect x="98.5" y="0.5" width="38" height="38" rx="19" stroke="white"/>
                          <path d="M127.539 13.5045C127.421 13.0134 127.179 12.5633 126.838 12.1999C126.498 11.8365 126.07 11.5725 125.6 11.4347C123.88 11 117 11 117 11C117 11 110.12 11 108.4 11.4761C107.93 11.6139 107.502 11.8779 107.162 12.2413C106.821 12.6047 106.579 13.0548 106.461 13.5459C106.146 15.3525 105.992 17.1851 106.001 19.0207C105.989 20.8702 106.143 22.7167 106.461 24.5369C106.592 25.0128 106.839 25.4457 107.179 25.7938C107.518 26.1419 107.939 26.3933 108.4 26.5239C110.12 27 117 27 117 27C117 27 123.88 27 125.6 26.5239C126.07 26.3861 126.498 26.1221 126.838 25.7587C127.179 25.3953 127.421 24.9452 127.539 24.4541C127.852 22.6612 128.006 20.8425 127.999 19.0207C128.011 17.1712 127.857 15.3247 127.539 13.5045Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M116 23L121 19.5L116 16V23Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <circle cx="167.5" cy="19.5" r="19" fill="#18968F" stroke="white"/>
                          <path d="M180 10.0101C178.955 10.6877 177.799 11.2059 176.575 11.5449C175.918 10.8502 175.044 10.3579 174.073 10.1344C173.102 9.91094 172.079 9.96715 171.144 10.2954C170.209 10.6237 169.406 11.2082 168.843 11.9699C168.281 12.7316 167.987 13.6338 168 14.5543V15.5574C166.083 15.6032 164.183 15.2122 162.47 14.4193C160.757 13.6265 159.284 12.4564 158.182 11.0132C158.182 11.0132 153.818 20.0415 163.636 24.054C161.39 25.4564 158.713 26.1595 156 26.0603C165.818 31.076 177.818 26.0603 177.818 14.5242C177.817 14.2448 177.788 13.9661 177.731 13.6916C178.844 12.6819 179.63 11.4072 180 10.0101Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          </div>
                  </div>
              </div>

            <div style="text-align: center; font-size: 14px; color: gray;">
                &copy; ${new Date().getFullYear()} SwiftHR. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `,
};

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("Email sent: " + info.response);
      res
        .status(200)
        .json({ message: "Check Your Email for Password Reset Link" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, newPass } = req.body;
  console.log(resetToken);

  try {
    // Find user by reset token and check token expiry
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(newPass, salt);
    console.log(newPassword);
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    // Save user
    await user.save();
    console.log("User saved successfully");

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUsers=async(req,res)=>{
  try {
    const Users = await User.find().populate("EmployeeId")
    if(!Users){
      return res.status(404).json({ message: "No Users found." });
    }
    return res.status(200).json({message:"Users fetched successfully",data:Users})
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Users", error });
  }
}
export { signin, verifySignInOtp, forgotPassword, resetPassword, resendOtp,getAllUsers };
