import { useState } from 'react';

const LoginForm = ({ onTelSubmit, disabled }) => {
  const [tel, setTel] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onTelSubmit(tel);
  };

  return (
      <form className="login-form" onSubmit={handleSubmit}>
        <h3 className="mb-5">Connexion Direct</h3>
        <div className="">
          <input
            className="form-control mb-4"
            placeholder="Numéro de téléphone"
            size="sm"
            type="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
        </div>
        <div>
          <button
            className="font-color-white border-none font-weight-semibold h-48 px-4 w-100 col-auto btn-valid"
            type="submit"
            disabled={disabled}
            onClick={handleSubmit}
          >
            Se connecter
          </button>
        </div>
      </form>
  );
};

export default LoginForm;