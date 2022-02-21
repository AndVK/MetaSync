const $buttonGo = document.getElementById('button-go');
const coinMass = [];

$buttonGo.addEventListener('click', async (event) => {
  event.preventDefault();
  
  const a = $('input:checked'); 
  const out = [];
  for (let x = 0; x < a.length; x += 1) {
    out.push(a[x].labels[0].innerHTML); 
  }

  const response = await fetch('/meta');
  const dataCoins = await response.json();
  console.log('response =====>', dataCoins);

  const $table = document.getElementById('table-coin');

  function createTr(data, index) {
    return `<tr>
    <th scope="row">${index + 1}</th>
    <td class="price-right">${data.name}/${data.symbol}</td>
    <td class="price-right">${data.quote.USD.price.toFixed(3)}</td>
    <td class="price-right">${data.quote.USD.market_cap.toFixed(2)}</td>
    <td class="price-24-center">${data.quote.USD.percent_change_24h.toFixed(2)}</td>
    </tr>`;
  }
  for (const item of out) {
    const coin = dataCoins.data.find((element) => element.name === item);
    if (coin) {
      console.log(coin);
      coinMass.push(coin);
    }
  }
  // появление таблицы
  document.querySelector('.table-crypto').style.opacity = '1';
  console.log(coinMass);
  for (let i = 0; i < coinMass.length; i += 1) {
    $table.insertAdjacentHTML('beforeend', createTr(coinMass[i], i));
  }
});

const $sendEmailForm = document.getElementById('send-email-form');

$sendEmailForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = Object.fromEntries(new FormData(event.target));
  console.log(formData);
  const dataToBack = { formData, coinMass };
  const res = await fetch('/courses', {
    method:'POST',
    headers:{
        'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(dataToBack),
  });

  if (res.ok) {
    alert('Данные успешно отправлены на почту');
  } else {
    alert('Не получилось добавить в базу, попробуйте позже!');
  }
});
