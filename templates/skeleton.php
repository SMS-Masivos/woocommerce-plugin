<style>
@keyframes sms-shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
}
.sms-sk {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 800px 100%;
    animation: sms-shimmer 1.5s infinite linear;
    border-radius: 6px;
}
.sms-skeleton-wrap {
    padding: 20px 0;
}
</style>
