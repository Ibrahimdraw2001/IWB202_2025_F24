$(document).ready(function() {

    $('#addAppForm').on('submit', function(e) {
        e.preventDefault();
        $('.error-message').remove();
        let isValid = true;
        const appName = $('#appName').val().trim();
        const company = $('#companyName').val().trim();
        const url = $('#appUrl').val().trim();
        const imageUrl = $('#appImageUrl').val().trim();
        // التحقق من اسم التطبيق (أحرف هجائية إنكليزية فقط، بدون فراغات)
        const appNameRegex = /^[A-Za-z]+$/;
        if (!appNameRegex.test(appName)) {
            $('#appName').after('<p class="error-message">الرجاء إدخال اسم التطبيق بأحرف إنكليزية هجائية فقط (بدون فراغات أو أرقام).</p>');
            isValid = false;
        }
        // التحقق من اسم الشركة المصنعة (أحرف هجائية إنكليزية وأرقام فقط)
        const companyRegex = /^[A-Za-z0-9\s]+$/;
        if (!companyRegex.test(company)) {
            $('#companyName').after('<p class="error-message">الرجاء إدخال اسم الشركة بأحرف إنكليزية هجائية وأرقام فقط.</p>');
            isValid = false;
        }
        // التحقق من الموقع الإلكتروني
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(url)) {
            $('#appUrl').after('<p class="error-message">الرجاء إدخال رابط موقع إلكتروني صحيح (يبدأ بـ http/https).</p>');
            isValid = false;
        }
        // التحقق من رابط الصورة
        if (!urlRegex.test(imageUrl)) {
            $('#appImageUrl').after('<p class="error-message">الرجاء إدخال رابط صورة صحيح وفعال (يجب أن يكون رابطاً).</p>');
            isValid = false;
        }
        if (isValid) {
            let storedApps = JSON.parse(localStorage.getItem('newApps')) || [];
            const newApp = {
                name: appName,
                company: company,
                usage: $('#usageField').val(),
                isFree: $('#isFreeField').val() === 'true', 
                url: url,
                imageUrl: imageUrl,
                description: $('#appDescription').val().trim()
            };

            // إضافة التطبيق الجديد
            storedApps.push(newApp);
            localStorage.setItem('newApps', JSON.stringify(storedApps));
            // الانتقال إلى صفحة عرض التطبيقات
            window.location.href = 'apps.html';
        }
    });
    $('#resetButton').on('click', function() {
        $('#addAppForm')[0].reset();
        $('.error-message').remove(); 
    });

    if (window.location.pathname.endsWith('apps.html')) {

        function setupToggleDetails() {
            $('.toggle-details').off('click').on('click', function(e) {
                e.preventDefault();
                const detailsRow = $(this).closest('tr').next('.details-row');
                detailsRow.toggle(400);
                
                if (detailsRow.is(':visible')) {
                    $(this).text('إخفاء التفاصيل');
                } else {
                    $(this).text('إظهار التفاصيل');
                }
            });
        }
        setupToggleDetails();
        let newApps = JSON.parse(localStorage.getItem('newApps')) || [];
        
        if (newApps.length > 0) {
            const tableBody = $('#appsTableBody');
            
            newApps.forEach((app, index) => {
                const isFreeText = app.isFree ? 'مجاني' : 'غير مجاني';
                const rowId = `dynamic-row-${index}`;
                const newRow = `
                    <tr id="${rowId}">
                        <td>${app.name}</td>
                        <td>${app.company}</td>
                        <td>${app.usage}</td>
                        <td>${isFreeText}</td>
                        <td><a href="#" class="toggle-details">إظهار التفاصيل</a></td>
                    </tr>
                `;
                tableBody.append(newRow);
                 const detailsRow = `
                    <tr class="details-row" style="display: none;">
                        <td colspan="5">
                            <div class="app-details">
                                <p><strong>اسم التطبيق:</strong> ${app.name}</p>
                                <p><strong>الشركة المطورة/مجال الاستخدام:</strong> ${app.company} / ${app.usage}</p>
                                <p><strong>مجاني/غير مجاني:</strong> ${isFreeText}</p>
                                <p><strong>عنوان الموقع الإلكتروني:</strong> <a href="${app.url}" target="_blank">${app.url}</a></p>
                                <p><strong>شرح مختصر:</strong> ${app.description}</p>
                                <p><strong>شعار التطبيق:</strong> 
                                    <img src="${app.imageUrl}" onerror="this.onerror=null; this.src='https://placehold.co/100x100/CCCCCC/000000?text=Logo';" alt="شعار ${app.name}" class="app-logo">
                                </p>
                                
                            </div>
                        </td>
                    </tr>
                `;
                tableBody.append(detailsRow);
            });
            setupToggleDetails();
        }
    }
});
