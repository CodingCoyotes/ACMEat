def restaurant_abort(order_id, success, paid, payment_success, TTW):
    print(f"[{order_id.value}] Restaurant abort procedure started!")
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value}