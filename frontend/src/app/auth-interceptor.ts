import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('Token');

  //console.log('Intercepting Request to:', req.url);
  //console.log('Token found in storage:', token ? 'YES (Starts with ' + token.substring(0,10) + '...)' : 'NO');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  return next(req);
};
