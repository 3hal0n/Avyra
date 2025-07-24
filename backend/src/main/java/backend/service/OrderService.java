package backend.service;
//
//import backend.dto.CheckoutResponseDTO;
//import backend.model.Order;
//
//import java.util.List;
//
//public interface OrderService {
//    CheckoutResponseDTO checkout();
//    List<Order> getOrdersForAuthenticatedUser();
//
//}

import backend.model.Order;
import backend.dto.CheckoutResponseDTO;

import java.util.List;

public interface OrderService {
    CheckoutResponseDTO checkout();
    List<Order> getOrdersForAuthenticatedUser();
    Order getOrderByIdForAuthenticatedUser(Long id);
}
