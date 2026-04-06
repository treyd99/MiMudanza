let cajas = JSON.parse(localStorage.getItem("cajas")) || [];

function guardarDatos() {
  localStorage.setItem("cajas", JSON.stringify(cajas));
}


function crearCaja() {
  const input = document.getElementById("nombreCaja");
  const nombre = input.value;

  if (nombre === "") return;

  const nuevaCaja = {
    nombre: nombre,
    objetos: [],
    desempacada: false
  };

  cajas.push(nuevaCaja);
  input.value = "";

  guardarDatos();
  renderizarCajas();
}

function renderizarCajas() {
  const contenedor = document.getElementById("listaCajas");
  contenedor.innerHTML = "";

  cajas.forEach((caja, index) => {
    const activa = cajaSeleccionada === index;

    const preview = caja.objetos.slice(0, 3).join(", ");

    contenedor.innerHTML += `
      <div class="caja" style="background: ${activa ? '#e6f7ff' : 'white'}">
        <h3>📦 ${caja.nombre}</h3>

        <div>
          <button title="Ver" onclick="verCaja(${index})">
            ${activa ? "🔽" : "▶️"}
          </button>
          <button title="Eliminar" onclick="eliminarCaja(${index})">🗑️</button>
        </div>

        ${preview ? `<small>${preview}${caja.objetos.length > 3 ? '...' : ''}</small>` : ''}
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

    <button onclick="eliminarCaja(${cajaSeleccionada})">
      🗑️ Eliminar
    </button>

    <br><br>

    <input type="text" id="objetoDetalle" placeholder="Agregar objeto">
    <button onclick="agregarObjetoDetalle()">Agregar</button>

    <ul>
      ${caja.objetos.map(obj => `<li>${obj}</li>`).join("")}
    </ul>
  `;
}

function agregarObjetoDetalle() {
  const input = document.getElementById("objetoDetalle");
  const nombre = input.value;

  if (nombre === "") return;

  cajas[cajaSeleccionada].objetos.push(nombre);
  input.value = "";

  guardarDatos();
  renderizarDetalleCaja();
}

function agregarObjeto(index) {
  const input = document.getElementById(`objeto-${index}`);
  const nombre = input.value;

  if (nombre === "") return;

  cajas[index].objetos.push(nombre);
  input.value = "";

  guardarDatos();
  renderizarCajas();
}

function toggleDesempacada(index) {
  cajas[index].desempacada = !cajas[index].desempacada;

  guardarDatos();
  renderizarCajas();
}

function eliminarCaja(index) {
  console.log("Eliminar caja:", index);

  const confirmar = confirm("¿Seguro que quieres eliminar esta caja?");
  if (!confirmar) return;

  cajas.splice(index, 1);

  guardarDatos();
  renderizarCajas();
}


function buscarObjeto() {
  const texto = document.getElementById("busqueda").value.toLowerCase();
  const resultadosDiv = document.getElementById("resultadosBusqueda");

  resultadosDiv.innerHTML = "";

  if (texto === "") return;

  let resultados = [];

  cajas.forEach((caja) => {
    caja.objetos.forEach((objeto) => {
      if (objeto.toLowerCase().includes(texto)) {
        resultados.push({
          objeto: objeto,
          caja: caja.nombre
        });
      }
    });
  });

  if (resultados.length === 0) {
    resultadosDiv.innerHTML = "<p>No se encontraron resultados</p>";
    return;
  }

  resultadosDiv.innerHTML = resultados
    .map(r => `<p>🔎 ${r.objeto} → ${r.caja}</p>`)
    .join("");
}

let cajaSeleccionada = null;

function verCaja(index) {
  if (cajaSeleccionada === index) {
    // Si ya está abierta, la cerramos
    cajaSeleccionada = null;
  } else {
    // Si no, abrimos esa caja
    cajaSeleccionada = index;
  }

  renderizarCajas();
  renderizarDetalleCaja();
}

renderizarCajas();