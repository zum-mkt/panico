import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { getSetting } from "@/services/homeService";

export type MarketingSettings = {
  ga_id?: string;
  gtm_id?: string;
  meta_pixel_id?: string;
  clarity_id?: string;
};

/**
 * Scripts globais de marketing (Google Analytics, GTM, Meta Pixel,
 * Microsoft Clarity) — ver 12-SEO_E_MARKETING.md e
 * 18-CONFIGURACOES_GERAIS.md. Configurados via /admin/configuracoes,
 * lidos aqui de `settings.marketing`. Nenhum script é injetado
 * enquanto o respectivo ID não é preenchido.
 */
export function MarketingScripts() {
  const { data } = useQuery({
    queryKey: ["settings", "marketing"],
    queryFn: () => getSetting<MarketingSettings>("marketing"),
  });

  if (!data) return null;

  return (
    <Helmet>
      {data.ga_id && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${data.ga_id}`} />
      )}
      {data.ga_id && (
        <script>
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${data.ga_id}');`}
        </script>
      )}

      {data.gtm_id && (
        <script>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${data.gtm_id}');`}
        </script>
      )}

      {data.meta_pixel_id && (
        <script>
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${data.meta_pixel_id}');
fbq('track', 'PageView');`}
        </script>
      )}

      {data.clarity_id && (
        <script>
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window, document, "clarity", "script", "${data.clarity_id}");`}
        </script>
      )}
    </Helmet>
  );
}
