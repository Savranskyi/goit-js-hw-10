export function fetchCountries(name) {
  const address = 'https://restcountries.com/v3.1/name/';
  const options = `?fields=name,capital,population,flags,languages`;

  return fetch(`${address}${name}${options}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
