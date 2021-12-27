export function prepararFechaParaBD(fecha) {

  function meterCeros(num, ceros) {
    let str = num.toString();
    while (str.length < ceros) {
      str = "0" + str;
    }
    return str;
  }

  return meterCeros(fecha.getFullYear(), 4)
    + "-" + meterCeros(fecha.getMonth() + 1, 2)
    + "-" + meterCeros(fecha.getDate(), 2)
    + " " + meterCeros(fecha.getHours(), 2)
    + ":" + meterCeros(fecha.getMinutes(), 2)
    + ":" + meterCeros(fecha.getSeconds(), 2)
    + ".000000";

}

export function importarFechaDeBD(str) {
  const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.(\d{6})$/;
  const matches = str.match(regex);
  if (matches !== null) {
    const fecha = new Date(
      parseInt(matches[1]), parseInt(matches[2]) - 1, parseInt(matches[3]),
      parseInt(matches[4]), parseInt(matches[5]), parseInt(matches[6]));
    if (fecha instanceof Date && !isNaN(fecha.valueOf())) {
      return fecha
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function importarFechaDeFormulario(str) {
  const regex = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{6})))?$/;
  const matches = str.match(regex);
  if (matches !== null) {

    let fecha = null;
    if (matches[4] !== undefined) {
      fecha = new Date(
        parseInt(matches[1]), parseInt(matches[2]) - 1, parseInt(matches[3]),
        parseInt(matches[4]), parseInt(matches[5]), parseInt(matches[6]));
    } else {
      fecha = new Date(
        parseInt(matches[1]), parseInt(matches[2]) - 1, parseInt(matches[3]),
        0, 0, 0);
    }
    if (fecha instanceof Date && !isNaN(fecha.valueOf())) {
      return fecha
    } else {
      return null;
    }

  } else {
    return null;
  }
}

export function parteFechaIgual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate();
}