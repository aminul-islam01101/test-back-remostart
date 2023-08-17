exports.emailVerifyBody = (url, option, otp = '') => `
<div style="position: relative; display: flex; min-height: 100vh; flex-direction: column; justify-content: center; overflow: hidden; background-color: #f9fafb; padding-top: 6rem; padding-bottom: 12rem;">
  <div style="position: relative; background-color: #ffffff; padding-left: 1.5rem; padding-right: 1.5rem; padding-bottom: 2rem; padding-top: 2.5rem; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); border: 1px solid rgba(17, 24, 39, 0.05); margin-left: auto; margin-right: auto; max-width: 28rem; border-radius: 0.375rem; padding-left: 2.5rem; padding-right: 2.5rem;">
    <div style="margin-left: auto; margin-right: auto; max-width: 28rem; text-align: center;">
      <img src="https://remostarts.com/assets/logoBlack-7334f407.svg" style="margin-left: auto; margin-right: auto;" alt="remostarts" />
      <div style="border-color: rgba(156, 163, 175, 0.5);">
        <div style="margin-bottom: 2rem; margin-top: 2rem; font-size: 1rem; line-height: 1.75rem; color: #4b5563;">
          <h2 style="font-size: 1.875rem; font-weight: 500; padding-bottom:30px;">Thank you for SignUp, ${option.name} </h2>
          <p>
            Dear User,
          </p>
          <p>
            We have received a request to verify your email address. To proceed with the verification, please click the link below:
          </p>
          ${otp ? `<div style="margin-bottom: 1.5rem; margin-top: 1.5rem;"><p style="font-size: 1.5rem; font-weight: 700; padding:30px;">Your OTP is <span style="letter-spacing: 0.05em;">${otp}</span></p></div>` : ''}
          <div style="margin-bottom: 1.5rem; margin-top: 1.5rem;">
            <a href="${url}" style="border-radius: 0.375rem; border-color:#7c3aed; background-color: #7c3aed; padding-left: 1rem; padding-right: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem; font-weight: 700; color: #ffffff; text-decoration: none; cursor: pointer; outline: none; transition: background-color 0.15s ease-in-out; display: inline-block;">
            Verify Email
            </a>
          </div>
          <div style="margin-bottom: 1rem;">
            <h3 style="font-size: 1rem;">Please note that the link will be disabled in 10 minutes.</h3>
            <h3 style="font-size: 1rem;">If you already verified your email address, please ignore this email.</h3>
          </div>
          <p>Thank you!</p>
        </div>
        <div style="padding-top: 2rem; font-size: 1rem; font-weight: 600; line-height: 1.75rem;">
          <p style="color: #1f2937;font-weight: 800;">Need Support?</p>
          <p>Mail us at info@remostarts.com</p>
        </div>
      </div>
    </div>
  </div>
</div>
`;
