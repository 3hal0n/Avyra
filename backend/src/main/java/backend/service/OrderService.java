package backend.service;

import backend.dto.CheckoutResponseDTO;
import backend.model.Order;

import java.util.List;

public interface OrderService {
    CheckoutResponseDTO checkout();
    List<Order> getOrdersForAuthenticatedUser();

}
