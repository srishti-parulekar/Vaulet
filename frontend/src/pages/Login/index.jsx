import Form from "../../components/Form";
import "./Login.css"
function Login() {
  return <Form route="/api/token/" method="login" />
}
export default Login;