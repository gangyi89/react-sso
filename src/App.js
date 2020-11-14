
import './App.css';
import { Formik, Field, Form } from 'formik';
import Amplify, { Auth, API, Storage } from "aws-amplify";

Amplify.configure({
  Auth: {

      mandatorySignIn: true,
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: 'ap-southeast-1:f3de596c-9ad4-47e7-a3a7-7832e6390e2e',

      // REQUIRED - Amazon Cognito Region
      region: 'ap-southeast-1',

      identityPoolRegion: 'ap-southeast-1',

      userPoolId: 'ap-southeast-1_P1P5mTUBd',

      userPoolWebClientId: '7i3cj113pinapc4jj4hjhkbch3',

      oauth: {
        domain: "klatchdev.auth.ap-southeast-1.amazoncognito.com",
        redirectSignIn: "http://localhost:3000/",
        redirectSignOut: "http://localhost:3000/",
        responseType: "code"
      }
  },

  API: {
    endpoints: [
        {
            name: "klatchApi",
            endpoint: "https://aj7sxgolwg.execute-api.ap-southeast-1.amazonaws.com/dev",
            region: "ap-southeast-1"
        }
    ]
  },

  Storage: {
    AWSS3: {
      bucket: 'klatch-dev-static',
      region: 'ap-southeast-1'
    }
  }
});

// You can get the current config object
//const currentConfig = Auth.configure();

const signup = ({name, email, password}) => {
  Auth.signUp({
    username: email,
    password,
    attributes: {
        email,          // optional
        name,   // optional 
    }
})
  .then(data => {
    alert("sign up success");
    console.log(data);
  })
  .catch(err => console.log("error", err));
}

const confirmCode = ({email, code}) => {
  Auth.confirmSignUp(email, code)
  .then(data => {
    alert("confirmation code success");
    console.log(data);
  })
  .catch(err => console.log("error", err));
}

const signIn = ({email, password}) => {
  Auth.signIn(email, password)
  .then(data => {
    alert("sign in success");
    console.log(data);
  })
  .catch(err => console.log("error", err));
}


//get api
const getApi = () => {
  API.get("klatchApi", "/test")
  .then(response => {console.log(response)})
  .catch(err => console.log(err));
  Auth.currentSession()
    .then(data => {
      console.log(data);
    })
    .catch(err => console.log(err));
  
  const credentials = Auth.Credentials;
  console.log(credentials);
}

//get api
const getPrivateApi = () => {
  API.get("klatchApi", "/test/organiser")
  .then(response => {console.log(response)})
  .catch(err => console.log(err));
  Auth.currentSession()
    .then(data => {
      console.log(data);
    })
    .catch(err => console.log(err));
  
  const credentials = Auth.Credentials;
  console.log(credentials);
}

const uploadPublic = () => {
  Storage.put('event/test.txt', 'Hello')
    .then (result => console.log(result))
    .catch(err => console.log(err));
}

const uploadProtected = () => {
  Storage.put('test.txt', 'Protected Content', {
    level: 'protected',
    contentType: 'text/plain'
})
.then (result => console.log(result))
.catch(err => console.log(err));
}

const uploadPrivate = () => {
  Storage.put('test.txt', 'Private Content', {
    level: 'private',
    contentType: 'text/plain'
})
.then (result => console.log(result))
.catch(err => console.log(err));
}

function App() {
  return (
    <div className="App">
      <div>
      <h3>Sign up form</h3>
      <Formik 
      initialValues={{name: '', email:'', password:''}}
      onSubmit = {(values) => {
        console.log("values: ", values);
        signup(values);
      }}>
        <Form>
        <Field name="name" placeholder="Enter name"/>
          <Field name="email" type="email" placeholder="Enter Email"/>
          <Field name="password" type="password" placeholder="Enter Password"/>
          <button type="submit">Signup</button>
        </Form>
      </Formik>
      </div>

      <div>
      <h3>Email confirmation code</h3>
      <Formik 
      initialValues={{email:'', code: ''}}
      onSubmit = {(values) => {
        console.log("values: ", values);
        confirmCode(values);
      }}>
        <Form>
        <Field name="email" type="email" placeholder="Enter Email"/>
        <Field name="code" placeholder="confirmation code"/>
          <button type="submit">Confirm code</button>
        </Form>
      </Formik>
      </div>

      <div>
      <h3>Sign in</h3>
      <Formik 
      initialValues={{email:'', password: ''}}
      onSubmit = {(values) => {
        console.log("values: ", values);
        signIn(values);
      }}>
        <Form>
        <Field name="email" type="email" placeholder="Enter Email"/>
        <Field name="password" type="password" placeholder="Enter Password"/>
          <button type="submit">Sign In</button>
        </Form>
      </Formik>
      </div>

      <div>
      <h3>Google sign in</h3>
        <button onClick={() => {
          Auth.federatedSignIn({provider: 'Google'})

        }}>Google Signin</button>
      </div>
      <div>
      <h3>Single sign in</h3>
        <button onClick={() => {
          Auth.federatedSignIn();

        }}>SSO</button>
      </div>

      <div>
      <h3>Call Api</h3>
        <button type="submit" onClick={getApi}>free api</button>
      </div>
      <div>
      <h3>Call Auth Api</h3>
        <button type="submit" onClick={getPrivateApi}>auth api</button>
      </div>
      <div>
      <h3>Upload Examples</h3>
        <button type="submit" onClick={uploadPublic}>Upload Public</button>
        <button type="submit" onClick={uploadProtected}>Upload Protected</button>
        <button type="submit" onClick={uploadPrivate}>Upload Private</button>
      </div>

    </div>
  );
}

export default App;
