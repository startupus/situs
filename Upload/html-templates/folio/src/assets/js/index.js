import "../css/tailwind.css";

import intersect from "@alpinejs/intersect";
import Alpine from "alpinejs";

Alpine.plugin(intersect);
window.Alpine = Alpine;

Alpine.start();
