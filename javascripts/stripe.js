var apiKey;
var account;

if (window.location.hostname === 'localhost') {
  // Check to see if we are working locally and should use test data.
  apiKey = 'pk_test_xNRNG2yhQBWXuqNaXyeEMgCo';
  account = 'test';
} else {
  // Use the live key.
  // Stripe is fine with publishing the *public* API key. There's a separate
  // secret one that allows for the actual charging of cards and such.
  apiKey = 'pk_live_t544EMRV55N0hw6a6dGSPpJs';
  account = 'techlady';
}

var handler = StripeCheckout.configure({
  key: apiKey,
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  token: function(token) {
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.
    var amount = Number(document.getElementById('donation-amount').value + "00")
    var instruction = document.getElementById('special-instructions').value
    // Send a request to our AWS Lambda function, which handles the
    // secret Stripe stuff.
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://b9sq87esw7.execute-api.us-east-2.amazonaws.com/prod/stripe-processor', true);
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        console.log(200);
        console.log(xhr);
        // Request finished.
      } else {
        console.log('not 200');
        console.log(xhr);
      }
    }
    xhr.send(
      JSON.stringify({
        "token": token.id,
        "amount": amount,
        "instruction": instruction,
        "email": token.email,
        "account": account
      })
  );
  }
});

document.getElementById('donationButton').addEventListener('click', function(e) {
  // Open Checkout with further options:
  handler.open({
    name: 'Tech Lady Hackathon',
    description: 'Donation',
    amount: Number(document.getElementById('donation-amount').value + "00"),
    allowRememberMe: false
  });
  e.preventDefault();
});

// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
  handler.close();
});