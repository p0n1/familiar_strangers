# Familiar Strangers

In the realm of the familiar, where logic gates are the silent sentinels of truth, lies a challenge shrouded in enigma. "Familiar Strangers" beckons you to a world where the simplest of circuits hide secrets just beyond the veil of obviousness. These circuits, reminiscent of the ones you've met countless times, now hold a mystery that only a true Circom savant can unravel. Three levels, each a step deeper into the cryptic dance of numbers and logic, await your prowess. Are you ready to discover the true inputs and reveal the concealed answers within? Find the key, communicate with our judge service, and claim your place among the elite who see beyond the familiar to the truth that lies beneath.

## How to play?

1. Install the latest circom, check <https://docs.circom.io/getting-started/installation/>.
2. Install the dependencies with `npm install`.
3. Read the [circuit](circuits/challenge.circom) and [stranger_judge.js](stranger_judge.js) carefully to understand the challenge.
4. Find the correct inputs and send to the judge service to win the challenge.

## How to run judge service?

For local testing, you can run the judge service with:

```shell
node stranger_judge.js
```

## How to send request to judge service?

Example request with curl:

```shell
curl -X POST http://localhost:3000/judge -H "Content-Type: application/json" -d '{"l1": "123", "l2": ["1", "2", "3"], "l3": "123"}'
```

The `l1`, `l2` and `l3` are the three levels of this challenge. The level 2 has three rounds, so the `l2` is an array of three strings.

The service will return `{"success":true}` when the input is correct, otherwise it will return `{"success":false}`.

## Reference

We include the below files in README for your convenience. You should always read the latest code in the correct location.

The [challenge.circom](circuits/challenge.circom) is the circuits for this challenge.

The [stranger_judge.js](stranger_judge.js) is the code for the judge service.
