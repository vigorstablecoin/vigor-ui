import * as React from 'react';

interface IProps {
  /**
   * Click event handler
   * @default null
   */
  onClick?: () => void;
}

const Button: React.SFC<IProps> = ({ children, onClick }) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);

export default Button;
