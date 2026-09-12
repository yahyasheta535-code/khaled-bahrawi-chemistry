import type { NextPageContext } from "next";

type ErrorPageProps = { statusCode?: number };

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  return (
    <main style={{ padding: 40, fontFamily: "Arial", direction: "rtl" }}>
      <h1>حدث خطأ {statusCode ? `(${statusCode})` : "غير متوقع"}</h1>
      <a href="/">العودة للمنصة</a>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => ({
  statusCode: res?.statusCode ?? err?.statusCode ?? 500,
});
