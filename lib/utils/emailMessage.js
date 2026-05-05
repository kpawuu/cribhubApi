"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * emailMessage — CribHub branded HTML email wrapper.
 *
 * @param message  Pre-escaped HTML for the message body (inner content).
 * @param ctaUrl   Optional call-to-action URL — renders a primary button.
 * @param ctaLabel Optional label for the CTA button (defaults to "Open in CribHub").
 */
const emailMessage = async (message, ctaUrl, ctaLabel = 'Open in CribHub') => {
    const brandName = process.env.APP_NAME || 'CribHub';
    const logoUrl = process.env.APP_LOGO_URL || '';
    const year = new Date().getFullYear();
    const primaryColor = '#4f46e5';
    const primaryDark = '#4338ca';
    const textColor = '#111827';
    const subtleColor = '#6b7280';
    const borderColor = '#e5e7eb';
    const bgColor = '#f9fafb';
    const logoBlock = logoUrl
        ? `<img src="${logoUrl}" alt="${brandName}" style="height:36px;width:auto;display:block;margin:0 auto;" />`
        : `<span style="font-size:20px;font-weight:800;color:${primaryColor};letter-spacing:-0.5px;">${brandName}</span>`;
    const ctaBlock = ctaUrl
        ? `
      <tr>
        <td align="center" style="padding:28px 0 8px;">
          <a
            href="${ctaUrl}"
            style="
              display:inline-block;
              background-color:${primaryColor};
              color:#ffffff;
              font-family:Inter,Arial,sans-serif;
              font-size:14px;
              font-weight:600;
              text-decoration:none;
              padding:12px 28px;
              border-radius:6px;
              letter-spacing:0.01em;
            "
          >${ctaLabel}</a>
        </td>
      </tr>
    `
        : '';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brandName}</title>
</head>
<body style="margin:0;padding:0;background-color:${bgColor};font-family:Inter,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${bgColor};padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

          <!-- Logo header -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              ${logoBlock}
            </td>
          </tr>

          <!-- Top accent bar -->
          <tr>
            <td style="background-color:${primaryColor};height:3px;border-radius:6px 6px 0 0;"></td>
          </tr>

          <!-- Body card -->
          <tr>
            <td style="background-color:#ffffff;border:1px solid ${borderColor};border-top:none;border-radius:0 0 8px 8px;padding:32px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Message content -->
                <tr>
                  <td style="font-family:Inter,Arial,sans-serif;font-size:15px;color:${textColor};line-height:1.7;">
                    ${message}
                  </td>
                </tr>

                <!-- CTA button -->
                ${ctaBlock}

                <!-- Divider -->
                <tr>
                  <td style="padding-top:28px;">
                    <hr style="border:none;border-top:1px solid ${borderColor};margin:0;" />
                  </td>
                </tr>

                <!-- Opt-out note -->
                <tr>
                  <td style="padding-top:16px;font-family:Inter,Arial,sans-serif;font-size:12px;color:${subtleColor};line-height:1.6;">
                    You received this email because you have an account on ${brandName}.
                    You can manage your notification preferences in your
                    <a href="${process.env.APP_URL || '#'}/profile" style="color:${primaryColor};text-decoration:none;">account settings</a>.
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:20px;font-family:Inter,Arial,sans-serif;font-size:12px;color:${subtleColor};">
              © ${year} ${brandName}. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
};
exports.default = emailMessage;
//# sourceMappingURL=emailMessage.js.map