/**
 * Wrapper HTML compartilhado pelos e-mails transacionais — mantém a
 * identidade visual do site (04-DESIGN_SYSTEM.md) mesmo fora do React,
 * já que e-mails não podem depender do bundle/CSS do app.
 */
export function renderEmail(params: {
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}): string {
  const { title, bodyHtml, ctaLabel, ctaUrl, footerNote } = params;
  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:32px 16px;background:#F5F6F8;font-family:Georgia,'Playfair Display',serif;">
    <table role="presentation" width="100%" style="max-width:480px;margin:0 auto;background:#FFFFFF;border-radius:24px;overflow:hidden;border:1px solid #DEE2E7;">
      <tr>
        <td style="padding:40px 32px 8px;text-align:center;">
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;color:#2F6690;text-transform:uppercase;">Funerária Paníco</p>
          <h1 style="margin:0;font-size:24px;line-height:1.3;color:#16283D;font-weight:normal;">${title}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 32px 8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1E2226;">
          ${bodyHtml}
        </td>
      </tr>
      ${
        ctaLabel && ctaUrl
          ? `<tr>
        <td style="padding:16px 32px 32px;text-align:center;">
          <a href="${ctaUrl}" style="display:inline-block;background:#16283D;color:#FFFFFF;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;padding:14px 28px;border-radius:16px;">${ctaLabel}</a>
        </td>
      </tr>`
          : ""
      }
      <tr>
        <td style="padding:16px 32px 32px;border-top:1px solid #DEE2E7;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#4F6478;">
          ${footerNote ?? ""}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
