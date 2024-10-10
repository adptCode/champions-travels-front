import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authToken = localStorage.getItem('authToken'); // Prendi il token dal localStorage

  console.log('Interceptor activated, token:', authToken);  // Aggiungi questo per verificare


  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    console.log('Richiesta modificata con token:', authReq);

    return next(authReq); // Passa la richiesta modificata
  }

  return next(req); // Se non c'è il token, lascia la richiesta invariata
};
