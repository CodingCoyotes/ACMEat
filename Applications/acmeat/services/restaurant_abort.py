def restaurant_abort(order_id, success, paid, payment_success, TTW):
    """
    Annullamento presso il ristorante - Di fatto, dato che il ristorante si appoggia per la gestione ordini
    ad acmeat, non viene fatto niente dato che viene avvisato automaticamente al refresh successivo degli ordini.
    """
    print(f"[{order_id.value}] Restaurant abort procedure started!")
    return {"order_id": order_id.value, "success": success.value, "paid": paid.value,
            "payment_success": payment_success.value, "TTW": TTW.value}