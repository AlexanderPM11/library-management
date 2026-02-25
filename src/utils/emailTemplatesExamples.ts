export const emailTemplatesExamples = {
  welcome: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f1117; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f1117; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table max-width="600" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1c23; border: 1px solid #2d303b; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <!-- Header/Hero -->
          <tr>
            <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%); border-bottom: 1px solid rgba(255,255,255,0.05);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; background: -webkit-linear-gradient(0deg, #818cf8, #e879f9); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">¡Bienvenido a {{LibraryName}}!</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #94a3b8;">
                Hola <strong>{{UserName}}</strong>,
              </p>
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #94a3b8;">
                Nos emociona mucho tenerte con nosotros. Tu cuenta ha sido creada exitosamente y ya puedes comenzar a explorar el sistema y todas las herramientas disponibles en tu sucursal.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{LoginLink}}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(to right, #4f46e5, #c026d3); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
                      Iniciar Sesión Ahora
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; background-color: #13151a; border-top: 1px solid #2d303b;">
              <p style="margin: 0; font-size: 13px; color: #64748b;">
                Si tienes alguna pregunta, no dudes en contactar al administrador de tu sucursal.<br>
                &copy; {{CurrentYear}} {{LibraryName}}. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

  passwordReset: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer Contraseña</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f1117; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f1117; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table max-width="600" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1c23; border: 1px solid #2d303b; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <!-- Header/Hero -->
          <tr>
            <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%); border-bottom: 1px solid rgba(255,255,255,0.05);">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff;">Restablecimiento de Contraseña</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #94a3b8;">
                Hola <strong>{{UserName}}</strong>,
              </p>
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #94a3b8;">
                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>{{LibraryName}}</strong>. Si fuiste tú, haz clic en el siguiente botón para crear una nueva contraseña. El enlace expirará pronto por razones de seguridad.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ResetLink}}" style="display: inline-block; padding: 16px 32px; background: #ffffff; color: #0f1117; text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 12px; box-shadow: 0 0 20px rgba(255,255,255,0.1);">
                      Restablecer Contraseña
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.5; color: #64748b;">
                Si tú no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña actual seguirá siendo válida.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; background-color: #13151a; border-top: 1px solid #2d303b;">
              <p style="margin: 0; font-size: 13px; color: #64748b;">
                &copy; {{CurrentYear}} {{LibraryName}}. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

  emailConfirmation: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirma tu Correo</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f1117; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f1117; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table max-width="600" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1c23; border: 1px solid #2d303b; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <!-- Header/Hero -->
          <tr>
            <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%); border-bottom: 1px solid rgba(255,255,255,0.05);">
               <div style="margin-bottom: 20px;">
                  <span style="display:inline-block; padding: 12px; background: rgba(16, 185, 129, 0.2); border-radius: 50%;">
                    <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" width="32" height="32" style="filter: invert(70%) sepia(30%) saturate(1000%) hue-rotate(100deg);" alt="Check">
                  </span>
               </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #34d399;">Verifica tu Identidad</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #94a3b8;">
                Hola <strong>{{UserName}}</strong>,
              </p>
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #94a3b8;">
                Para completar la configuración de tu cuenta en <strong>{{LibraryName}}</strong> y asegurarnos de que la dirección ingresada es tuya, por favor aprueba este correo electrónico haciendo clic a continuación:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ConfirmLink}}" style="display: inline-block; padding: 16px 32px; border: 1px solid #34d399; color: #34d399; background: rgba(52, 211, 153, 0.1); text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 12px; transition: all 0.3s;">
                      Confirmar mi Correo
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.5; color: #64748b;">
                O copia y pega el siguiente enlace en tu navegador:<br>
                <a href="{{ConfirmLink}}" style="color: #818cf8; word-break: break-all;">{{ConfirmLink}}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; background-color: #13151a; border-top: 1px solid #2d303b;">
              <p style="margin: 0; font-size: 13px; color: #64748b;">
                &copy; {{CurrentYear}} {{LibraryName}}. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
};
