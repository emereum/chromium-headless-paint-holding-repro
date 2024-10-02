Steps to reproduce:

```
git clone https://github.com/emereum/chromium-headless-paint-holding-repro
pushd chromium-headless-paint-holding-repro
yarn && yarn test
```

* Expected outcome: FP and FCP are identical in headless mode
* Actual outcome: FP and FCP differ in headless mode