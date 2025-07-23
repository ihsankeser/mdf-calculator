import { useEffect } from "react";

export default function LoginRedirect() {
  useEffect(() => {
    // HashRouter altında çalışması için:
    window.location.hash = "#/step3";
  }, []);

  return (
    <div className="p-8 text-center">
      <p className="text-gray-700 text-lg">Giriş başarılı, yönlendiriliyorsunuz...</p>
    </div>
  );
}
