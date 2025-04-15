namespace IntelliBiz.API.DTOs
{
    public class ApiResponseDto<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
        
        public static ApiResponseDto<T> SuccessResponse(T data, string message = "Operation successful")
        {
            return new ApiResponseDto<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }
        
        public static ApiResponseDto<T> ErrorResponse(string message = "An error occurred")
        {
            return new ApiResponseDto<T>
            {
                Success = false,
                Message = message,
                Data = default
            };
        }
    }
}
