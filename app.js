let cajas = JSON.parse(localStorage.getItem("cajas")) || [];
let cajaSeleccionada = null;

function guardarDatos() {
  localStorage.setItem("cajas", JSON.stringify(cajas));
}

function crearCaja() {
  const input = document.getElementById("nombreCaja");
  if (!input.value) return;

  cajas.push({ nombre: input.value, objetos: [], desempacada: false });
  input.value = "";

  guardarDatos();
  renderizarCajas();
}

function renderizarCajas() {
  const contenedor = document.getElementById("listaCajas");
  contenedor.innerHTML = "";

  cajas.forEach((caja, index) => {
    const activa = cajaSeleccionada === index;

    contenedor.innerHTML += `
      <div class="caja ${caja.desempacada ? 'desempacada' : ''}"><div class="contenido">
      <h3 onclick="verCaja(${index})">📦 ${caja.nombre}</h3>
    </div>

    <div class="botones">
      <button onclick="verCaja(${index})">${activa ? "🔽" : "▶️"}</button>
      <button onclick="eliminarCaja(${index})">🗑️</button>
    </div>

  </div>
`;
  });
}

function renderizarDetalleCaja() {
  const contenedor = document.getElementById("detalleCaja");

  if (cajaSeleccionada === null) {
    contenedor.innerHTML = "";
    return;
  }

  const caja = cajas[cajaSeleccionada];

  contenedor.innerHTML = `
    <h2>${caja.nombre}</h2>

    <button onclick="toggleDesempacada(${cajaSeleccionada})">
      ${caja.desempacada ? "Marcar pendiente" : "Desempacada"}
    </button>

    <br><br>

    <input id="objetoDetalle" placeholder="Agregar objeto">
    <button onclick="agregarObjetoDetalle()">Agregar</button>

    <ul>
      ${caja.objetos.map(o => `<li>${o}</li>`).join("")}
    </ul>
  `;
}

function agregarObjetoDetalle() {
  const input = document.getElementById("objetoDetalle");
  if (!input.value) return;

  cajas[cajaSeleccionada].objetos.push(input.value);
  input.value = "";

  guardarDatos();
  renderizarDetalleCaja();
}

function eliminarCaja(index) {
  if (!confirm("¿Eliminar caja?")) return;

  cajas.splice(index, 1);
  cajaSeleccionada = null;

  guardarDatos();
  renderizarCajas();
  renderizarDetalleCaja();
}

function toggleDesempacada(index) {
  cajas[index].desempacada = !cajas[index].desempacada;

  guardarDatos();
  renderizarCajas();
  renderizarDetalleCaja();
}

function verCaja(index) {
  cajaSeleccionada = cajaSeleccionada === index ? null : index;

  renderizarCajas();
  renderizarDetalleCaja();
}

function buscarObjeto() {
  const texto = document.getElementById("busqueda").value.toLowerCase();
  const resultados = document.getElementById("resultadosBusqueda");

  if (!texto) {
    resultados.innerHTML = "";
    return;
  }

  let encontrados = [];

  cajas.forEach(caja => {
    caja.objetos.forEach(obj => {
      if (obj.toLowerCase().includes(texto)) {
        encontrados.push(`🔎 ${obj} → ${caja.nombre}`);
      }
    });
  });

  resultados.innerHTML = encontrados.length
    ? encontrados.map(e => `<p>${e}</p>`).join("")
    : "<p>No encontrado</p>";
}

renderizarCajas();