import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";
import { useTheme } from "./themeprovider.jsx";

export default function Logo() {
  const { theme } = useTheme();

  return (
    <img
      src={theme === "dark" ? logoDark : logoLight}
      alt="Nexhire"
      className="w-40 sm:w-48"
    />
  );
}
