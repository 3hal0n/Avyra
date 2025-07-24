package backend.service.impl;

import backend.dto.CheckoutResponseDTO;
import backend.model.*;
import backend.repository.CartItemRepository;
import backend.repository.OrderItemRepository;
import backend.repository.OrderRepository;
import backend.service.OrderService;
import backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserService userService;

    @Override
    public List<Order> getOrdersForAuthenticatedUser() {
        User user = userService.getAuthenticatedUser();
        return orderRepository.findByUser(user);
    }


    @Override
    @Transactional // IMPORTANT!
    public CheckoutResponseDTO checkout() {
        User user = userService.getAuthenticatedUser();

        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Your cart is empty.");
        }

        Order order = new Order(user, LocalDateTime.now());
        order = orderRepository.save(order); // Save early to get ID

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem(
                    order,
                    cartItem.getGame(),
                    cartItem.getQuantity(),
                    cartItem.getGame().getPrice()
            );
            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteAll(cartItems);

        return new CheckoutResponseDTO(order.getId(), "Checkout successful!", order.getCreatedAt());
    }
}
