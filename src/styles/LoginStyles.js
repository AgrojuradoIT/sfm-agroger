// src/styles/LoginStyles.js
// No need to import Material UI components for style objects

// Company colors
export const PRIMARY_COLOR = 'rgb(56, 85, 37)';
export const SECONDARY_COLOR = 'rgb(107, 163, 54)';

// Using sx prop styles instead of styled components to avoid compatibility issues
export const backgroundContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
  overflow: 'hidden'
};

export const loginPaperStyle = {
  p: 4,
  width: 350,
  maxWidth: '90%',
  borderRadius: 2,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderTop: `4px solid ${PRIMARY_COLOR}`
};

export const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

export const loginFormStyle = {
  mt: 1,
  width: '100%'
};

// Style for TextField focus color
export const textFieldStyle = {
  '& label.Mui-focused': {
    color: PRIMARY_COLOR,
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: SECONDARY_COLOR,
    },
  },
};

export const errorAlertStyle = {
  mb: 2,
  '& .MuiAlert-icon': {
    color: PRIMARY_COLOR
  }
};

export const logoStyle = {
  width: '180px',
  marginBottom: '20px'
};

export const juradoLogoStyle = {
  width: '120px',
  margin: '20px auto 0',
  display: 'block'
};

export const copyrightTextStyle = {
  mt: 4,
  color: 'white',
  textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
};

export const loginButtonStyle = {
  mt: 3,
  mb: 2,
  py: 1.5,
  borderRadius: 2,
  backgroundColor: PRIMARY_COLOR,
  '&:hover': {
    backgroundColor: 'rgba(56, 85, 37, 0.9)'
  }
};

export const loadingIndicatorStyle = {
  mr: 1
};

export const logoImageStyle = {
  width: '120px',
  marginBottom: '20px'
};

export const logoJuradoImageStyle = {
  width: '120px',
  marginTop: '30px',
  position: 'relative'
};

export const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxSizing: 'border-box',
  '&:disabled': {
    backgroundColor: '#f5f5f5',
    cursor: 'not-allowed'
  }
};

export const styledButtonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: PRIMARY_COLOR,
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '10px',
  fontSize: '16px',
  boxSizing: 'border-box',
  '&:hover': {
    backgroundColor: 'rgba(56, 85, 37, 0.9)'
  },
  '&:disabled': {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed'
  }
};

export const copyrightStyle = {
  marginTop: '20px',
  color: 'white',
  fontSize: '14px',
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
  textAlign: 'center'
};

export const errorMessageStyle = {
  color: '#dc3545',
  fontSize: '14px',
  marginTop: '8px',
  textAlign: 'center'
};