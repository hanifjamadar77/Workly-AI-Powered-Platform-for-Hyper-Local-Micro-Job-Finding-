import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { changeAppLanguage } from "../i18n";

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  const setLanguage = async (language: string) => {
    await changeAppLanguage(language);
    setLang(language); // 🔁 trigger re-render
  };

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  return { lang, setLanguage };
};
