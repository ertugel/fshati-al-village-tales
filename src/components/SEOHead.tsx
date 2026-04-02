import { Helmet } from "react-helmet-async";

const BASE_URL = "https://fshati-al-village-tales.lovable.app";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

const SEOHead = ({ title, description, path = "", keywords, ogImage, jsonLd }: SEOHeadProps) => {
  const url = `${BASE_URL}${path}`;
  const image = ogImage || `${BASE_URL}/og-image.jpg`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
