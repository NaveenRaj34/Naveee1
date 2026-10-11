"""
JobShield AI - Custom REST API Exception Handler
Standardizes all DRF error responses into predictable JSON schemas.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        message = "An error occurred processing your request."
        errors = {}

        if isinstance(response.data, dict):
            if "detail" in response.data:
                message = str(response.data["detail"])
            else:
                errors = response.data
                first_key = next(iter(errors), None)
                if first_key and isinstance(errors[first_key], list) and len(errors[first_key]) > 0:
                    message = f"{first_key.replace('_', ' ').capitalize()}: {errors[first_key][0]}"
                else:
                    message = "Input validation failed."
        elif isinstance(response.data, list):
            errors = {"general": response.data}
            message = response.data[0] if response.data else "Validation error"

        response.data = {
            "success": False,
            "message": message,
            "errors": errors if errors else None
        }

    return response
