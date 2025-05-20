<button class="custom-download-btn" id="downloadBellBtn" style="margin: 1em 1em 1em 0;">Download Bell Devices</button>
<button class="custom-download-btn" id="downloadVirginBtn" style="margin: 1em 0;">Download Virgin Devices</button>

<#noparse>
<script>
const bellBtn = document.getElementById("downloadBellBtn");
const virginBtn = document.getElementById("downloadVirginBtn");

bellBtn.addEventListener("click", () => downloadXml("bell"));
virginBtn.addEventListener("click", () => downloadXml("virgin"));

async function downloadXml(type) {
  const btn = type === "bell" ? bellBtn : virginBtn;
  const apiUrl = type === "bell"
    ? "https://bell-device-products.onrender.com/list"
    : "https://virgin-device-products.onrender.com/list";
  const fileName = type === "bell" ? "bell-products.xml" : "virgin-products.xml";

  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Generating XML...";

  try {
    const response = await fetch(apiUrl);
    const { products } = await response.json();

    // === Static product categories block ===
    const productCategories = `
  <product_categories>
    <item xsi:type="product_category">
      <id>Apple</id>
      <title>Apple</title>
      <external_update_time>2017-07-24T12:00:00</external_update_time>
    </item>
    <item xsi:type="product_category">
      <id>Samsung</id>
      <title>Samsung</title>
      <external_update_time>2017-07-24T12:00:00</external_update_time>
    </item>
    <item xsi:type="product_category">
      <id>Google</id>
      <title>Google</title>
      <external_update_time>2017-07-24T12:00:00</external_update_time>
    </item>
    <item xsi:type="product_category">
      <id>Motorola</id>
      <title>Motorola</title>
      <external_update_time>2017-07-24T12:00:00</external_update_time>
    </item>
    <item xsi:type="product_category">
      <id>TCL</id>
      <title>TCL</title>
      <external_update_time>2017-07-24T12:00:00</external_update_time>
    </item>
    <item xsi:type="product_category">
      <id>Huawei</id>
      <title>Huawei</title>
      <external_update_time>2017-07-24T12:00:00</external_update_time>
    </item>
  </product_categories>`;

    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<productCatalog xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`;

    const xmlItems = products.map(product => {
      const name = escapeXml(product.name);
      const id = escapeXml(product.name);
      const product_url = escapeXml(product.link);
      const image_url = escapeXml(product.img?.startsWith('/') ? `https://www.bell.ca${product.img}` : product.img);
      const category = escapeXml(getCategoryName(product.name, type));

      return `
    <item xsi:type="product">
      <id>${id}</id>
      <title>${name}</title>
      <product_url>${product_url}</product_url>
      <image_url>${image_url}</image_url>
      <product_categories>
        <items>
          <item xsi:type="product_category">
            <id>${category}</id>
          </item>
        </items>
      </product_categories>
      <description>${name}</description>
      <external_update_time>$${new Date().toISOString()}</external_update_time>
    </item>`;
    }).join("\n");

    const xmlFooter = `  </products>\n</productCatalog>`;

    const finalXml = xmlHeader + "\n" + productCategories + "\n  <products>\n" + xmlItems + "\n" + xmlFooter;

    const blob = new Blob([finalXml], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

  } catch (err) {
    console.error("Error generating XML:", err);
    alert("Failed to generate XML file.");
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

function escapeXml(str) {
  return str?.replace(/[<>&'"]/g, c => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
  }[c])) || '';
}

function getCategoryName(source, type) {
    const name = source.toLowerCase();
    if (name.includes("apple") || name.includes("ipad") || name.includes("iphone")) return "Apple";
    if (name.includes("samsung")) return "Samsung";
    if (name.includes("google")) return "Google";
    if (name.includes("motorola") || name.includes("moto")) return "Motorola";
    if (name.includes("tcl")) return "TCL";
    if (name.includes("huawei")) return "Huawei";
    if (name.includes("ahlo")) return "Ahlo";
    if (name.includes("zte")) return "ZTE";
    return "Uncategorized";
}
</script>
</#noparse>

<style>
.custom-download-btn {
  background-color: #003366; /* dark blue */
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.custom-download-btn:hover {
  background-color: #00264d;
}
</style>
