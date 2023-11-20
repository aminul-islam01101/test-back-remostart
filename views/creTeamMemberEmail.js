exports.createUserEmail = (userId, password, role,  loginLink) => `
<div style="position: relative; display: flex; min-height: 100vh; flex-direction: column; justify-content: center; overflow: hidden; background-color: #f9fafb; padding-top: 6rem; padding-bottom: 12rem;">
  <div style="position: relative; background-color: #ffffff; padding-left: 1.5rem; padding-right: 1.5rem; padding-bottom: 2rem; padding-top: 2.5rem; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); border: 1px solid rgba(17, 24, 39, 0.05); margin-left: auto; margin-right: auto; max-width: 28rem; border-radius: 0.375rem; padding-left: 2.5rem; padding-right: 2.5rem;">
    <div style="margin-left: auto; margin-right: auto; max-width: 28rem; text-align: center;">
      <img src="https://remostarts.com/assets/logoBlack-7334f407.svg" style="margin-left: auto; margin-right: auto;" alt="remostarts" />
      <div style="border-color: rgba(156, 163, 175, 0.5);">
     
          <!-- Additional Info -->
          <div style="margin-bottom: 1rem; margin-top: 2rem;">
          <h3> welcome on board, ${role}</h3>
            <p>User ID: ${userId}</p>
            <p>Password: ${password}</p>
            <p>Login link: <a href="${loginLink}">${loginLink}</a></p>
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
