/* Global Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
  .animate-fade-in-down { animation: fadeInDown 0.5s ease-out forwards; }
  .animate-fade-in-left { animation: fadeInLeft 0.5s ease-out forwards; }
  .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
  
  /* Custom radio button styles for better visual */
  .form-radio {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: inline-block;
    vertical-align: middle;
    background-origin: border-box;
    user-select: none;
    flex-shrink: 0;
    border-radius: 100%;
    border-width: 2px;
    border-color: #d1d5db; /* gray-300 */
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); /* No initial shadow */
  }
  .form-radio:checked {
    background-color: #4f46e5; /* indigo-600 */
    border-color: #4f46e5; /* indigo-600 */
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }
  .form-radio:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5); /* indigo-500 with opacity */
  }
  
  
  /* Print specific styles */
  @media print {
    .no-print {
      display: none !important;
    }
    body {
      background-color: #fff !important;
    }
    .print-page {
      box-shadow: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  }
