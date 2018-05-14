import {TestBed} from "@angular/core/testing";
import {HttpClientModule} from "@angular/common/http";
import {PactWeb, Matchers} from "@pact-foundation/pact-web/pact-web";
import {CustomerService} from "C:/Workplace/Educama/Showcase/frontend/src/app/customer/customer-common/api/customer.service";
import {CustomerResource} from "C:/Workplace/Educama/Showcase/frontend/src/app/customer/customer-common/api/resources/customer.resource";
import {Address} from "C:/Workplace/Educama/Showcase/frontend/src/app/customer/customer-common/api/datastructures/address.datastructure";

describe("Test", () => {
  describe("CustomerService", () => {

    let provider;

    beforeAll(function (done) {
      provider = new PactWeb({
        consumer: "ui",
        provider: "CustomerService",
        port: 1234,
        host: "127.0.0.1",
      });

      // required for slower CI environments
      setTimeout(done, 2000);

      // Required if run with `singleRun: false`
      // provider.removeInteractions();
    });

    afterAll(function (done) {
      provider.finalize()
        .then(function () {
          done();
        }, function (err) {
          done.fail(err);
        });
    });

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule
        ],
        providers: [
          CustomerService
        ],
      });
    });

    afterEach((done) => {
      provider.verify().then(done, e => done.fail(e));
    });

    describe("createCustomer()", () => {
      const address: Address = {
        street: "str",
        streetNo: "1",
        zipCode: "111",
        city: "rt"
      };
      const expectedCustomer: CustomerResource = {
        uuid: "100",
        name: "Dent",
        address: address
      };
      const expectedResponse = {
        "uuid": "54b2a69a-7976-4135-a338-3586ac67895e",
        "name": "John Doe",
        "address": {
          "street": "Normal street",
          "streetNo": "234",
          "zipCode": "10000",
          "city": "Nowhere"
        },
        "_links": {
          "self": {
            "href": "http://localhost:8081/educama/v1/customers/54b2a69a-7976-4135-a338-3586ac67895e"
          }
        }
      };
      beforeAll((done) => {
        provider.addInteraction({
          state: `provider accepts a new customer`,
          uponReceiving: "a request to POST a new Customer",
          withRequest: {
            method: "POST",
            path: "/educama/v1/customers",
            body: expectedCustomer,
            headers: {
              "Content-Type": "application/json"
            }
          },
          willRespondWith: {
            status: 201,
            body: Matchers.somethingLike({
              json: expectedResponse
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        }).then(done, error => done.fail(error));
      });

      it("should create a customer", (done) => {
        const costumerService: CustomerService = TestBed.get(CustomerService);
        costumerService.createCustomer(expectedCustomer).subscribe(response => {
          expect(response).toEqual(expectedResponse);
          done();
        }, error => {
          done.fail(error);
        });
      });

    });

  });
});

