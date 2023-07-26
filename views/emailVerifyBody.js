exports.emailVerifyBody = (url, option, otp = '') => `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    h1 {
      text-align: center;
    }

    .content {
      margin-top: 20px;
    }

    .button {
      display: inline-block;
      background-color: #4CAF50;
      color: #fff;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
    }

    .button:hover {
      background-color: #45a049;
    }

    .disabled-message {
      font-weight: bold;
    }

    .otp-container {
      margin-top: 20px;
      margin-bottom: 20px;
      display: flex;
      justify:center,
      align-items: center;
    }

    .otp-text {
      background-color: black;
      color: white;
      padding: 10px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      border-radius: 5px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Verify Your Email</h1>
    <div class="content">
      <p>Dear User,</p>
      <p>We have received a request to verify your email address. To proceed with the verification, please click the link below:</p>
      ${otp ? `<div class="otp-container"><span class="otp-text">${otp}</span></div>` : ''}
      <p>
        <a class="button" href=${url}>Click Here to ${option}</a>
      </p>
      <p class="disabled-message">NB: Please note that the link will be disabled in 10 minutes.</p>
      <p>If you already verified your email address , please ignore this email.</p>
      <p>Thank you!</p>
      <p>Remostarts</p>
    </div>
  </div>
</body>
</html>
`;
