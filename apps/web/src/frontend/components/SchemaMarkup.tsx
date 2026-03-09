import { ReactNode } from "react";

export default function SchemaMarkup(): ReactNode {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rensa",
    url: "https://rensa.site",
    description:
      "Photography sharing platform where every picture tells its recipe",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://rensa.site/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Rensa",
      logo: {
        "@type": "ImageObject",
        url: "https://rensa.site/logo.png",
        width: 250,
        height: 60,
      },
    },
    sameAs: [
      "https://www.facebook.com/rensa",
      "https://twitter.com/rensaphoto",
      "https://instagram.com/rensaphoto",
    ],
  };

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Rensa - Where Every Picture Tells Its Recipe",
    description:
      "Discover photography inspiration on Rensa. Explore creative photo recipes, share your vision, and learn techniques behind stunning photos.",
    url: "https://rensa.site",
    mainEntity: {
      "@type": "CreativeWork",
      name: "Photography Community",
      description: "Share and discover photography recipes and techniques",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
    </>
  );
}
