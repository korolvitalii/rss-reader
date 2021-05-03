install:
		npm install
lint:
		npx eslint .
test:
		npx jest
test-coverage:
		npm test -- --coverage --coverageProvider=v8