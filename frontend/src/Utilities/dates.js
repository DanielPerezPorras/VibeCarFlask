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
    + ":00.000000";

}