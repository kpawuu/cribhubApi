const emailMessage = async (message: string, url?: string): Promise<string> => {
  const buttonHtml = url
    ? `
      <tr>
        <td style="text-align:center; padding:20px;">
          <a href="${url}" style="background-color:#0F4C75; color:white; padding:12px 22px; text-align:center; text-decoration:none; display:inline-block; font-size:14px; margin:4px 2px; cursor:pointer; border-radius:10px;">Open</a>
        </td>
      </tr>
    `
    : ''

  const brandName = process.env.APP_NAME || 'RentFlow'
  const logoUrl = process.env.APP_LOGO_URL || ''

  const html = `
    <html>
      <body bgcolor="#f3f4f6">
        <table width="650" border="0" align="center" cellpadding="5" cellspacing="2" bgcolor="#f3f4f6">
          <tr>
            <td style="font-family:Inter, Arial, sans-serif; padding:18px; text-align:center; background-color:#FFFFFF; border:1px solid #e5e7eb; border-radius:8px;">
              ${logoUrl ? `<img src="${logoUrl}" alt="${brandName} Logo" style="max-width:180px; height:auto; display:block; margin:0 auto;" />` : `<div style="font-weight:800; font-size:18px; color:#1B262C;">${brandName}</div>`}
            </td>
          </tr>
          <tr>
            <td valign="top" bgcolor="#FFFFFF" style="border:1px solid #e5e7eb; border-radius:8px;">
              <table width="100%" border="0" cellpadding="5" cellspacing="0">
                <tr>
                  <td style="font-family:Inter, Arial, sans-serif; font-size:14px; color:#111827; text-align:left; padding:18px; line-height:1.6;">
                    ${message}
                  </td>
                </tr>
                ${buttonHtml}
              </table>
            </td>
          </tr>
          <tr>
            <td style="font-family:Inter, Arial, sans-serif; font-size:12px; color:#6b7280; text-align:center; padding:14px;">
              © ${new Date().getFullYear()} ${brandName}. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  return html
}

export default emailMessage

