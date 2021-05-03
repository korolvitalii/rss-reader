install:
		npm install
lint:
		npx eslint .
jest:
		npx jest
test-coverage:
		npm test -- --coverage --coverageProvider=v8