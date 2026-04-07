import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Check, X, ArrowRight, RefreshCw, Trophy, BookOpen, Brain, Pencil, Clock, Flame, Trash2, Home, Repeat, ListChecks, Zap, CheckCircle2 } from 'lucide-react';

// Bộ dữ liệu từ vựng (Đã thêm trường 'test' để phân loại cho chế độ Ôn theo test)
const RAW_VOCAB = [
  // Cam 16 Test 1
  { test: "Cam 16 Test 1", vocab: "Consequence", meaning: "Hậu quả", type: "n", explanation: "Kết quả (thường tiêu cực) xảy ra sau một hành động hay sự việc.", example: "The long-term ______ of poor planning can be costly." },
  { test: "Cam 16 Test 1", vocab: "Adipose", meaning: "Thuộc về mỡ", type: "adj", explanation: "Dùng để mô tả mô/tế bào có chức năng dự trữ chất béo trong cơ thể.", example: "Seals rely on ______ tissue to stay warm in icy water." },
  { test: "Cam 16 Test 1", vocab: "Tissue", meaning: "Mô (sinh học)", type: "n", explanation: "Tập hợp tế bào cùng chức năng tạo nên cơ quan hoặc bộ phận của cơ thể.", example: "Doctors examined the damaged ______ under a microscope." },
  { test: "Cam 16 Test 1", vocab: "Suffer", meaning: "Chịu đựng, trải qua", type: "v", explanation: "Trải qua điều tồi tệ như đau đớn, mất mát hoặc khó khăn.", example: "Many animals ______ when food sources disappear." },
  { test: "Cam 16 Test 1", vocab: "Shed light on sthing", meaning: "Làm sáng tỏ, giải thích rõ", type: "idiom", explanation: "Cung cấp thông tin giúp một vấn đề trở nên dễ hiểu hơn.", example: "New evidence may ______ the cause of the disease." },
  { test: "Cam 16 Test 1", vocab: "Determine", meaning: "Quyết định, xác định", type: "v", explanation: "Tìm ra hoặc quyết định chính xác một điều gì đó.", example: "Scientists ______ the age of fossils using carbon dating." },
  { test: "Cam 16 Test 1", vocab: "Mutation", meaning: "Đột biến", type: "n", explanation: "Sự thay đổi trong gen hoặc DNA có thể làm thay đổi đặc điểm sinh học.", example: "A single ______ can affect how an organism develops." },
  { test: "Cam 16 Test 1", vocab: "Genome", meaning: "Bộ gen", type: "n", explanation: "Toàn bộ vật chất di truyền (tất cả gen) của một sinh vật.", example: "Researchers mapped the human ______ to understand inherited diseases." },
  { test: "Cam 16 Test 1", vocab: "Osteoporosis", meaning: "Loãng xương", type: "n", explanation: "Bệnh làm xương yếu và dễ gãy hơn do mất mật độ xương.", example: "Older adults may develop ______ if calcium intake is low." },
  { test: "Cam 16 Test 1", vocab: "Starvation", meaning: "Nạn đói", type: "n", explanation: "Tình trạng thiếu thức ăn nghiêm trọng trong thời gian dài.", example: "The drought led to widespread ______ in rural areas." },
  { test: "Cam 16 Test 1", vocab: "Undergo", meaning: "Trải qua", type: "v", explanation: "Trải nghiệm hoặc chịu đựng một quá trình/thay đổi nào đó.", example: "Patients ______ surgery to repair the injury." },
  { test: "Cam 16 Test 1", vocab: "Den", meaning: "Hang ổ của thú", type: "n", explanation: "Nơi trú ẩn của động vật hoang dã, thường là hang hoặc ổ kín.", example: "The bear returned to its ______ before nightfall." },
  { test: "Cam 16 Test 1", vocab: "Cub", meaning: "Thú non", type: "n", explanation: "Con non của một số loài thú như gấu, sư tử, cáo.", example: "A lion ______ stayed close to its mother." },
  { test: "Cam 16 Test 1", vocab: "Deplete", meaning: "Cạn kiệt", type: "v", explanation: "Làm giảm mạnh cho đến khi gần như hết sạch.", example: "Overfishing can ______ the ocean’s fish stocks." },
  { test: "Cam 16 Test 1", vocab: "Dense", meaning: "Dày đặc", type: "adj", explanation: "Có nhiều thứ chen chúc gần nhau; hoặc khó xuyên qua/dễ bị nén.", example: "The forest became so ______ that sunlight barely reached the ground." },
  { test: "Cam 16 Test 1", vocab: "Paradox", meaning: "Nghịch lý", type: "n", explanation: "Một điều tưởng như mâu thuẫn nhưng có thể đúng hoặc có ý nghĩa.", example: "It’s a ______ that saving time can sometimes waste time." },
  { test: "Cam 16 Test 1", vocab: "Hibernating", meaning: "Ngủ đông", type: "n", explanation: "Trạng thái ngủ dài để tiết kiệm năng lượng, thường vào mùa đông.", example: "A ______ animal can survive months with little food." },
  { test: "Cam 16 Test 1", vocab: "Resort to sthing", meaning: "Đành phải dùng đến", type: "idiom", explanation: "Làm điều không muốn làm vì không còn cách nào khác.", example: "When supplies ran out, they ______ eating wild plants." },
  { test: "Cam 16 Test 1", vocab: "Possess", meaning: "Sở hữu", type: "v", explanation: "Có hoặc nắm giữ một thứ gì đó (tài sản, đặc điểm, kỹ năng).", example: "Some animals ______ a strong sense of direction." },
  { test: "Cam 16 Test 1", vocab: "Perceive", meaning: "Nhận thức", type: "v", explanation: "Nhìn nhận, hiểu hoặc nhận ra điều gì đó bằng giác quan hoặc tư duy.", example: "Humans often ______ risk differently from experts." },
  { test: "Cam 16 Test 1", vocab: "Anecdotal", meaning: "Mang tính giai thoại", type: "adj", explanation: "Dựa trên câu chuyện cá nhân, không dựa trên nghiên cứu hay dữ liệu chắc chắn.", example: "The claim is ______ and not supported by scientific studies." },
  { test: "Cam 16 Test 1", vocab: "Assumption", meaning: "Giả định", type: "n", explanation: "Điều được cho là đúng dù chưa có bằng chứng chắc chắn.", example: "Their ______ about demand turned out to be wrong." },
  { test: "Cam 16 Test 1", vocab: "Manipulate", meaning: "Thao túng", type: "v", explanation: "Điều khiển hoặc tác động khéo léo để đạt mục đích (thường không minh bạch).", example: "Some ads try to ______ consumers into buying unnecessary products." },
  { test: "Cam 16 Test 1", vocab: "Lodge", meaning: "Khẳng định, nộp/đệ", type: "v", explanation: "Đưa ra một tuyên bố chính thức hoặc nộp đơn/khiếu nại.", example: "They ______ a formal complaint about the service." },
  { test: "Cam 16 Test 1", vocab: "Deliberate", meaning: "Cố ý, có chủ đích", type: "adj", explanation: "Được thực hiện một cách có tính toán và có mục đích rõ ràng.", example: "The damage appeared to be ______ rather than accidental." },
  { test: "Cam 16 Test 1", vocab: "Remarkably", meaning: "Đáng chú ý", type: "adv", explanation: "Ở mức độ gây ngạc nhiên hoặc rất nổi bật.", example: "The results improved ______ after the new method was applied." },
  { test: "Cam 16 Test 1", vocab: "Astonishing", meaning: "Đáng kinh ngạc", type: "adj", explanation: "Gây ngạc nhiên mạnh vì vượt xa mong đợi.", example: "It was ______ how quickly the ice melted." },
  { test: "Cam 16 Test 1", vocab: "Majestic", meaning: "Hùng vĩ", type: "adj", explanation: "To lớn, uy nghi, đẹp một cách ấn tượng.", example: "We saw ______ mountains rising above the clouds." },
  { test: "Cam 16 Test 1", vocab: "Grand", meaning: "Sự to lớn/quan trọng", type: "n", explanation: "Chỉ mức độ lớn lao hoặc tầm vóc ấn tượng, quan trọng.", example: "The project was ______ in scale and required years to complete." },
  { test: "Cam 16 Test 1", vocab: "Tribute", meaning: "Sự tri ân", type: "n", explanation: "Lời nói/hành động thể hiện sự tôn trọng và biết ơn.", example: "The ceremony was a ______ to the scientists who made the discovery." },
  { test: "Cam 16 Test 1", vocab: "Reign", meaning: "Triều đại; trị vì", type: "n / v", explanation: "Thời kỳ một vị vua/nữ hoàng cai trị; hoặc hành động cai trị.", example: "During her ______, the kingdom expanded rapidly." },
  { test: "Cam 16 Test 1", vocab: "Passage", meaning: "Lối đi; đoạn văn", type: "n", explanation: "Một lối đi hẹp; hoặc một đoạn trích trong văn bản.", example: "Please read the ______ and answer the questions below." },
  { test: "Cam 16 Test 1", vocab: "Conceive", meaning: "Nảy ra ý tưởng", type: "v", explanation: "Hình thành ý tưởng/kế hoạch trong đầu; nghĩ ra.", example: "It’s hard to ______ a solution without enough data." },
  { test: "Cam 16 Test 1", vocab: "Scholar", meaning: "Học giả", type: "n", explanation: "Người có kiến thức sâu và nghiên cứu chuyên môn trong một lĩnh vực.", example: "The ______ published a new book on ancient history." },
  { test: "Cam 16 Test 1", vocab: "Thorough", meaning: "Kỹ lưỡng", type: "adj", explanation: "Làm rất cẩn thận và đầy đủ, không bỏ sót chi tiết quan trọng.", example: "A ______ investigation revealed the real cause." },
  { test: "Cam 16 Test 1", vocab: "Inward", meaning: "Hướng vào trong", type: "adj", explanation: "Hướng về phía bên trong hoặc liên quan đến nội tâm.", example: "The walls curved ______ toward the center of the chamber." },
  { test: "Cam 16 Test 1", vocab: "Trench", meaning: "Rãnh, mương", type: "n", explanation: "Hào/rãnh dài và sâu, thường để thoát nước hoặc phòng thủ.", example: "Workers dug a ______ to lay the cables safely." },
  { test: "Cam 16 Test 1", vocab: "Accomplishment", meaning: "Thành quả", type: "n", explanation: "Điều đạt được sau nỗ lực, kỹ năng hoặc thời gian dài.", example: "Finishing the marathon was a major ______ for her." },
  { test: "Cam 16 Test 1", vocab: "Carve", meaning: "Chạm khắc", type: "v", explanation: "Cắt hoặc khắc lên vật liệu (gỗ, đá) để tạo hình/chữ.", example: "They ______ symbols into the stone tablet." },
  { test: "Cam 16 Test 1", vocab: "Chamber", meaning: "Phòng (họp/đại sảnh)", type: "n", explanation: "Một căn phòng lớn hoặc trang trọng, đôi khi dùng cho họp hành.", example: "The committee met in a private ______ to discuss the plan." },
  { test: "Cam 16 Test 1", vocab: "Beneath", meaning: "Ở dưới", type: "adv", explanation: "Ở vị trí thấp hơn hoặc bên dưới một vật.", example: "Hidden ______ the surface, the rocks were full of minerals." },
  { test: "Cam 16 Test 1", vocab: "Vessel", meaning: "Tàu lớn", type: "n", explanation: "Tàu thuyền dùng để vận chuyển người hoặc hàng hóa trên biển/sông.", example: "The ______ sailed through heavy fog." },
  { test: "Cam 16 Test 1", vocab: "Inscribe", meaning: "Khắc chữ (trang trọng)", type: "v", explanation: "Khắc chữ hoặc ký hiệu lên bề mặt (đá, kim loại) một cách trang trọng.", example: "They ______ the winner’s name on the trophy." },
  { test: "Cam 16 Test 1", vocab: "Archeologist", meaning: "Nhà khảo cổ học", type: "n", explanation: "Người nghiên cứu quá khứ thông qua di tích, hiện vật và tàn tích.", example: "An ______ discovered tools from an ancient settlement." },
  { test: "Cam 16 Test 1", vocab: "Excavate", meaning: "Khai quật", type: "v", explanation: "Đào bới có phương pháp để tìm và lấy hiện vật/di tích dưới lòng đất.", example: "The team began to ______ the site carefully." },
  { test: "Cam 16 Test 1", vocab: "Predecessors", meaning: "Người tiền nhiệm", type: "n", explanation: "Những người giữ vị trí/công việc trước đó.", example: "He improved the system built by his ______." },
  { test: "Cam 16 Test 1", vocab: "Shaft", meaning: "Trục; hầm đứng", type: "n", explanation: "Phần dài dạng trụ (trục/cán), hoặc hầm đứng trong khai thác mỏ.", example: "Miners descended the ______ to reach the tunnels below." },
  { test: "Cam 16 Test 1", vocab: "Intricate", meaning: "Phức tạp, tinh vi", type: "adj", explanation: "Có nhiều chi tiết đan xen, khó hiểu hoặc khó thực hiện.", example: "The device has an ______ design with many tiny parts." },
  { test: "Cam 16 Test 1", vocab: "Overlook", meaning: "Bỏ sót; nhìn từ trên cao", type: "n / v", explanation: "Không nhận ra/bỏ qua điều quan trọng; hoặc có tầm nhìn bao quát xuống dưới.", example: "It’s easy to ______ small errors in large datasets." },
  { test: "Cam 16 Test 1", vocab: "Exaggeration", meaning: "Phóng đại", type: "n", explanation: "Nói quá mức sự thật để gây ấn tượng hoặc thuyết phục.", example: "Calling it a disaster is an ______; the issue is minor." },
  { test: "Cam 16 Test 1", vocab: "Constitute", meaning: "Cấu thành", type: "v", explanation: "Tạo nên hoặc hợp thành một tổng thể.", example: "These factors ______ the core of the new policy." },
  { test: "Cam 16 Test 1", vocab: "Archetype", meaning: "Nguyên mẫu", type: "n", explanation: "Mẫu hình/kiểu mẫu tiêu biểu đại diện cho một nhóm hoặc ý tưởng.", example: "The hero is an ______ found in many myths." },
  { test: "Cam 16 Test 1", vocab: "Occupation", meaning: "Nghề nghiệp", type: "n", explanation: "Công việc hoặc nghề mà một người làm thường xuyên để kiếm sống.", example: "Her ______ involves analyzing customer behavior." },
  { test: "Cam 16 Test 1", vocab: "Embody", meaning: "Tượng trưng", type: "v", explanation: "Thể hiện rõ ràng một ý tưởng/đặc điểm; là hình ảnh tiêu biểu của điều đó.", example: "Her leadership style ______ the company’s values." },

  // Cam 16 Test 2
  { test: "Cam 16 Test 2", vocab: "Scatter", meaning: "Rải rác", type: "v", explanation: "Làm cho nhiều vật bị phân tán ra nhiều nơi, không tập trung một chỗ.", example: "The wind ______ leaves across the road." },
  { test: "Cam 16 Test 2", vocab: "Controversial", meaning: "Gây tranh cãi", type: "adj", explanation: "Gây ra nhiều ý kiến trái chiều, dễ dẫn đến tranh luận.", example: "The proposal became highly ______ among students." },
  { test: "Cam 16 Test 2", vocab: "Enigmatic", meaning: "Bí ẩn, khó hiểu", type: "adj", explanation: "Khó nắm bắt hoặc khó giải thích, tạo cảm giác bí ẩn.", example: "She gave an ______ smile and said nothing." },
  { test: "Cam 16 Test 2", vocab: "Convince", meaning: "Tin chắc, đoán chắc", type: "v", explanation: "Làm cho ai đó tin là đúng; thuyết phục bằng lý lẽ hoặc bằng chứng.", example: "The data should ______ them that the plan will work." },
  { test: "Cam 16 Test 2", vocab: "Priory", meaning: "Tu viện", type: "n", explanation: "Một tu viện nhỏ (thường do tu sĩ/tu nữ sinh sống và quản lý).", example: "The ancient ______ was built on a hill." },
  { test: "Cam 16 Test 2", vocab: "Reveal", meaning: "Tiết lộ", type: "v", explanation: "Làm lộ ra thông tin/sự thật trước đó bị che giấu hoặc chưa biết.", example: "The report ______ a sharp rise in costs." },
  { test: "Cam 16 Test 2", vocab: "Associate", meaning: "Liên kết, liên quan", type: "adj", explanation: "Có mối liên hệ hoặc được gắn với một người/sự việc nào đó.", example: "The symptoms are ______ with a lack of sleep." },
  { test: "Cam 16 Test 2", vocab: "Overlie", meaning: "Nằm trên, đặt trên", type: "v", explanation: "Nằm phủ lên hoặc ở phía trên một lớp/vật khác.", example: "A thin layer of soil ______ the rock." },
  { test: "Cam 16 Test 2", vocab: "Gleaming", meaning: "Sáng bóng", type: "v", explanation: "Phản chiếu ánh sáng, trông sáng và bóng loáng.", example: "The floor was ______ after it had been cleaned." },
  { test: "Cam 16 Test 2", vocab: "Bother", meaning: "Bận tâm", type: "v", explanation: "Làm phiền hoặc khiến ai đó lo lắng, khó chịu.", example: "It didn’t ______ him that others disagreed." },
  { test: "Cam 16 Test 2", vocab: "Steep", meaning: "Dốc đứng", type: "adj", explanation: "Có độ dốc lớn, rất nghiêng và khó leo/đi.", example: "They climbed a ______ path to the summit." },
  { test: "Cam 16 Test 2", vocab: "Fertility", meaning: "Sinh sản", type: "n", explanation: "Khả năng sinh sản hoặc tạo ra con cái/sự sinh trưởng.", example: "Stress can affect ______ in many species." },
  { test: "Cam 16 Test 2", vocab: "Ritual", meaning: "Theo lễ nghi", type: "adj", explanation: "Liên quan đến nghi thức, hành động thực hiện theo quy ước/lễ nghi.", example: "They performed a ______ ceremony before the harvest." },
  { test: "Cam 16 Test 2", vocab: "Depiction", meaning: "Miêu tả", type: "n", explanation: "Sự mô tả/hình ảnh thể hiện một người, vật hoặc sự kiện.", example: "The painting is a ______ of daily life in the past." },
  { test: "Cam 16 Test 2", vocab: "Cemetery", meaning: "Nghĩa trang", type: "n", explanation: "Nơi chôn cất người đã mất.", example: "They visited the ______ to pay respect." },
  { test: "Cam 16 Test 2", vocab: "Emblem", meaning: "Biểu tượng", type: "n", explanation: "Dấu hiệu/hình ảnh đại diện cho một ý tưởng, tổ chức hoặc giá trị.", example: "The dove is an ______ of peace." },
  { test: "Cam 16 Test 2", vocab: "Scour", meaning: "Lùng sục, tìm kiếm", type: "v", explanation: "Tìm kiếm rất kỹ, lục soát khắp nơi để tìm thứ gì đó.", example: "Rescuers ______ the area for survivors." },
  { test: "Cam 16 Test 2", vocab: "Testament", meaning: "Bằng chứng", type: "n", explanation: "Bằng chứng rõ ràng cho thấy điều gì đó là đúng hoặc tồn tại.", example: "The monument stands as a ______ to their courage." },
  { test: "Cam 16 Test 2", vocab: "Attest", meaning: "Chứng minh", type: "v", explanation: "Xác nhận hoặc làm bằng chứng cho một sự thật.", example: "Several witnesses can ______ to what happened." },
  { test: "Cam 16 Test 2", vocab: "Adequate", meaning: "Cân xứng", type: "adj", explanation: "Đủ mức cần thiết; phù hợp với yêu cầu/tình huống.", example: "Make sure you have ______ time to finish the task." },
  { test: "Cam 16 Test 2", vocab: "Inhabitant", meaning: "Cư dân", type: "n", explanation: "Người sinh sống ở một nơi (thành phố, vùng, quốc gia).", example: "Each ______ must follow local rules." },
  { test: "Cam 16 Test 2", vocab: "Intend", meaning: "Dự định", type: "v", explanation: "Có kế hoạch hoặc ý định làm điều gì đó.", example: "They ______ to expand the business next year." },
  { test: "Cam 16 Test 2", vocab: "Gesture", meaning: "Cử chỉ", type: "n", explanation: "Hành động/động tác thể hiện ý nghĩa, cảm xúc hoặc thái độ.", example: "A small ______ of kindness can change someone’s day." },
  { test: "Cam 16 Test 2", vocab: "Lessen", meaning: "Làm nhỏ đi", type: "v", explanation: "Làm giảm mức độ, cường độ hoặc số lượng.", example: "New policies may ______ the risk of accidents." },
  { test: "Cam 16 Test 2", vocab: "Fascinating", meaning: "Lôi cuốn, quyến rũ", type: "adj", explanation: "Rất thú vị, thu hút mạnh sự chú ý.", example: "It’s ______ to see how the brain learns languages." },
  { test: "Cam 16 Test 2", vocab: "Code of conduct", meaning: "Quy tắc ứng xử", type: "n", explanation: "Bộ quy tắc quy định hành vi/chuẩn mực cần tuân thủ trong một tổ chức.", example: "All members must follow the ______ at events." },
  { test: "Cam 16 Test 2", vocab: "Bacteria", meaning: "Vi khuẩn", type: "n", explanation: "Sinh vật đơn bào cực nhỏ, có thể có lợi hoặc gây bệnh.", example: "Some ______ help digestion, while others cause illness." },
  { test: "Cam 16 Test 2", vocab: "Outlive", meaning: "Sống lâu hơn", type: "v", explanation: "Sống lâu hơn ai đó hoặc lâu hơn một giai đoạn/sự kiện.", example: "Some trees ______ several generations of humans." },
  { test: "Cam 16 Test 2", vocab: "Ubiquitous", meaning: "Phổ biến", type: "adj", explanation: "Xuất hiện ở khắp nơi; rất phổ biến.", example: "Smartphones are now ______ in daily life." },
  { test: "Cam 16 Test 2", vocab: "Inhabit", meaning: "Cư trú", type: "v", explanation: "Sống hoặc cư trú trong một khu vực/địa điểm.", example: "Many species ______ the coral reefs." },
  { test: "Cam 16 Test 2", vocab: "Coral", meaning: "San hô", type: "n", explanation: "Sinh vật biển tạo rạn, thường có màu sắc đa dạng.", example: "Rising temperatures can damage ______ reefs." },
  { test: "Cam 16 Test 2", vocab: "Utterly", meaning: "Hoàn toàn", type: "adv", explanation: "Hoàn toàn, tuyệt đối (mức độ rất cao).", example: "The village was ______ silent at night." },
  { test: "Cam 16 Test 2", vocab: "Exaggerate", meaning: "Phóng đại", type: "v", explanation: "Nói quá sự thật để gây ấn tượng hoặc thuyết phục.", example: "Don’t ______ the problem; it’s manageable." },
  { test: "Cam 16 Test 2", vocab: "Plentiful", meaning: "Nhiều", type: "adj", explanation: "Dồi dào, có nhiều hơn đủ.", example: "Water is ______ during the rainy season." },
  { test: "Cam 16 Test 2", vocab: "Tend", meaning: "Có xu hướng", type: "v", explanation: "Thường có khuynh hướng xảy ra hoặc hành xử theo một cách.", example: "People ______ to spend more when they feel confident." },
  { test: "Cam 16 Test 2", vocab: "Extraordinariness", meaning: "Đặc biệt", type: "n", explanation: "Tính chất nổi bật, khác thường và đáng chú ý.", example: "The ______ of the discovery surprised the scientific community." },
  { test: "Cam 16 Test 2", vocab: "Potent", meaning: "Mạnh mẽ", type: "adj", explanation: "Mạnh, có tác dụng lớn (thuốc, ý tưởng, ảnh hưởng).", example: "This herb has a ______ effect on pain." },
  { test: "Cam 16 Test 2", vocab: "Magnify", meaning: "Mở rộng, khuếch đại", type: "v", explanation: "Làm cho to hơn hoặc làm tăng mức độ/tầm quan trọng.", example: "A microscope can ______ tiny organisms." },
  { test: "Cam 16 Test 2", vocab: "Tolerance", meaning: "Khả năng chịu đựng", type: "n", explanation: "Khả năng chịu được điều kiện khó chịu hoặc chấp nhận khác biệt.", example: "Heat ______ varies across individuals." },
  { test: "Cam 16 Test 2", vocab: "Vital", meaning: "Thiết yếu, quan trọng", type: "adj", explanation: "Cực kỳ quan trọng và không thể thiếu.", example: "Sleep is ______ for memory and learning." },
  { test: "Cam 16 Test 2", vocab: "Allergy", meaning: "Dị ứng", type: "n", explanation: "Phản ứng quá mức của cơ thể với một chất gây kích ứng.", example: "He has an ______ to peanuts." },
  { test: "Cam 16 Test 2", vocab: "Obsession", meaning: "Sự ám ảnh", type: "n", explanation: "Sự tập trung quá mức vào một ý nghĩ/đối tượng, khó dừng lại.", example: "Her ______ with perfection caused stress." },
  { test: "Cam 16 Test 2", vocab: "Hygiene", meaning: "Vệ sinh", type: "n", explanation: "Thói quen giữ sạch sẽ để bảo vệ sức khỏe.", example: "Good ______ reduces the spread of disease." },
  { test: "Cam 16 Test 2", vocab: "Soar", meaning: "Tăng vọt", type: "v", explanation: "Tăng rất nhanh và mạnh (giá, số lượng, mức độ).", example: "Housing prices ______ in major cities last year." },
  { test: "Cam 16 Test 2", vocab: "Desire", meaning: "Khao khát, mong muốn", type: "v", explanation: "Muốn một điều gì đó mạnh mẽ.", example: "Many graduates ______ practical experience." },
  { test: "Cam 16 Test 2", vocab: "Swallow", meaning: "Nuốt", type: "v", explanation: "Đưa thức ăn/nước xuống cổ họng; hoặc kìm nén cảm xúc.", example: "He tried to ______ his fear and speak calmly." },
  { test: "Cam 16 Test 2", vocab: "Adept", meaning: "Thông thạo", type: "adj", explanation: "Rất giỏi hoặc thành thạo trong một kỹ năng.", example: "She is ______ at solving complex problems." },
  { test: "Cam 16 Test 2", vocab: "Enthralling", meaning: "Hấp dẫn", type: "adj", explanation: "Cực kỳ cuốn hút, khiến người ta chăm chú theo dõi.", example: "The documentary was ______ from start to finish." },
  { test: "Cam 16 Test 2", vocab: "Bizarre", meaning: "Kỳ quái", type: "adj", explanation: "Lạ lùng, khác thường đến mức khó hiểu.", example: "They reported a ______ noise coming from the attic." },
  { test: "Cam 16 Test 2", vocab: "Digestion", meaning: "Tiêu hoá", type: "n", explanation: "Quá trình cơ thể phân giải thức ăn để hấp thụ dinh dưỡng.", example: "Fiber helps ______ and keeps you full longer." },
  { test: "Cam 16 Test 2", vocab: "Wisdom", meaning: "Thông thái", type: "n", explanation: "Sự hiểu biết sâu sắc và khả năng phán đoán đúng đắn.", example: "Experience often brings ______." },
  { test: "Cam 16 Test 2", vocab: "Wise", meaning: "Khôn ngoan", type: "adj", explanation: "Có khả năng lựa chọn đúng dựa trên hiểu biết và kinh nghiệm.", example: "It would be ______ to save money for emergencies." },
  { test: "Cam 16 Test 2", vocab: "Establish", meaning: "Thiết lập", type: "v", explanation: "Tạo dựng hoặc thiết lập một hệ thống, tổ chức hay sự thật.", example: "They ______ a new research center in 2024." },
  { test: "Cam 16 Test 2", vocab: "Absorbing", meaning: "Hấp dẫn", type: "adj", explanation: "Rất thú vị, khiến người ta tập trung và bị cuốn vào.", example: "The book is so ______ that I couldn’t put it down." },
  { test: "Cam 16 Test 2", vocab: "Alteration", meaning: "Thay đổi", type: "n", explanation: "Sự thay đổi (thường là chỉnh sửa) so với trạng thái ban đầu.", example: "Even a small ______ can improve performance." },
  { test: "Cam 16 Test 2", vocab: "Revere", meaning: "Tôn sùng", type: "v", explanation: "Kính trọng sâu sắc, tôn kính.", example: "Many people ______ leaders who act with integrity." },
  { test: "Cam 16 Test 2", vocab: "Come up with", meaning: "Nảy ra ý tưởng", type: "v", explanation: "Nghĩ ra/đưa ra một ý tưởng hoặc giải pháp.", example: "We need to ______ a better plan quickly." },
  { test: "Cam 16 Test 2", vocab: "Confront", meaning: "Làm cho đối mặt", type: "v", explanation: "Đối mặt trực tiếp với vấn đề hoặc thách thức.", example: "She decided to ______ the issue instead of avoiding it." },
  { test: "Cam 16 Test 2", vocab: "Recession", meaning: "Sự suy thoái", type: "n", explanation: "Giai đoạn kinh tế suy giảm kéo dài (tăng trưởng âm, thất nghiệp tăng...).", example: "During a ______, consumer spending often drops." },
  { test: "Cam 16 Test 2", vocab: "Crystallize", meaning: "Kết tinh", type: "v", explanation: "Trở nên rõ ràng/cụ thể hơn; hoặc tạo tinh thể.", example: "After the discussion, the idea began to ______." },
  { test: "Cam 16 Test 2", vocab: "Openness", meaning: "Sự cởi mở", type: "n", explanation: "Sẵn sàng tiếp nhận ý tưởng mới và giao tiếp thẳng thắn.", example: "Team ______ helps improve collaboration." },
  { test: "Cam 16 Test 2", vocab: "Agreeableness", meaning: "Sự dễ chịu", type: "n", explanation: "Tính cách dễ hợp tác, thân thiện và hay đồng cảm.", example: "High ______ often leads to smoother teamwork." },
  { test: "Cam 16 Test 2", vocab: "Assumption", meaning: "Giả định", type: "n", explanation: "Điều được cho là đúng dù chưa có bằng chứng chắc chắn.", example: "That ______ should be tested with real data." },
  { test: "Cam 16 Test 2", vocab: "Empirical", meaning: "Thực nghiệm", type: "adj", explanation: "Dựa trên quan sát, đo lường và bằng chứng thực tế.", example: "We need ______ evidence, not opinions." },
  { test: "Cam 16 Test 2", vocab: "Exceptional", meaning: "Phi thường, hiếm có", type: "adj", explanation: "Rất xuất sắc hoặc khác biệt theo hướng nổi bật.", example: "She showed ______ skill in analysis." },
  { test: "Cam 16 Test 2", vocab: "Trait", meaning: "Đặc điểm", type: "n", explanation: "Một đặc trưng hoặc tính chất thường thấy ở người/vật.", example: "Patience is a useful ______ for leaders." },
  { test: "Cam 16 Test 2", vocab: "Underestimate", meaning: "Đánh giá thấp", type: "v", explanation: "Ước lượng thấp hơn thực tế về mức độ/khả năng.", example: "Don’t ______ how long the project will take." },
  { test: "Cam 16 Test 2", vocab: "Experiential", meaning: "Kinh nghiệm", type: "adj", explanation: "Liên quan đến trải nghiệm thực tế và rút ra từ kinh nghiệm.", example: "Internships provide ______ learning that classes can’t replace." },
  { test: "Cam 16 Test 2", vocab: "Circumstance", meaning: "Hoàn cảnh", type: "n", explanation: "Điều kiện hoặc tình thế ảnh hưởng đến một sự việc.", example: "Under these ______, delays are understandable." },
  { test: "Cam 16 Test 2", vocab: "Characterize", meaning: "Biểu thị đặc điểm", type: "v", explanation: "Miêu tả đặc trưng/đặc điểm điển hình của ai đó hoặc cái gì đó.", example: "The period is ______ by rapid technological change." },
  { test: "Cam 16 Test 2", vocab: "Solely by", meaning: "Chỉ dựa trên", type: "adv", explanation: "Chỉ dựa vào một yếu tố duy nhất.", example: "Don’t judge performance ______ test scores." },
  { test: "Cam 16 Test 2", vocab: "Unfold", meaning: "Lộ ra", type: "v", explanation: "Dần dần diễn ra hoặc được hé lộ theo thời gian.", example: "A surprising story began to ______ during the interview." },
  { test: "Cam 16 Test 2", vocab: "Impartiality", meaning: "Sự công bằng", type: "n", explanation: "Tính không thiên vị, đánh giá dựa trên sự thật.", example: "A judge must show ______ in every case." },
  { test: "Cam 16 Test 2", vocab: "Partiality", meaning: "Sự thiên vị", type: "n", explanation: "Sự ưu ái hoặc thiên lệch về một phía.", example: "His ______ made the decision unfair." },
  { test: "Cam 16 Test 2", vocab: "Cognition", meaning: "Nhận thức", type: "n", explanation: "Quá trình tư duy: hiểu, ghi nhớ, học tập và ra quyết định.", example: "Sleep affects ______ and concentration." },
  { test: "Cam 16 Test 2", vocab: "Modesty", meaning: "Khiêm tốn", type: "n", explanation: "Tính không khoe khoang, biết giữ chừng mực.", example: "Her ______ impressed everyone despite her success." },
  { test: "Cam 16 Test 2", vocab: "Intellectual", meaning: "Về mặt trí tuệ", type: "adj", explanation: "Liên quan đến trí tuệ, tư duy và hoạt động học thuật.", example: "The debate was ______ and challenging." },
  { test: "Cam 16 Test 2", vocab: "Humility", meaning: "Khiêm tốn", type: "v", explanation: "Thể hiện thái độ khiêm nhường, không tự cao.", example: "He tried to ______ himself despite winning the award." },
  { test: "Cam 16 Test 2", vocab: "Compromise", meaning: "Thoả hiệp", type: "n", explanation: "Sự thỏa thuận bằng cách mỗi bên nhượng bộ một phần.", example: "They reached a ______ after hours of negotiation." },
  { test: "Cam 16 Test 2", vocab: "Extent", meaning: "Mức độ", type: "n", explanation: "Mức độ hoặc phạm vi mà một điều gì đó xảy ra.", example: "To what ______ does stress affect performance?" },
  { test: "Cam 16 Test 2", vocab: "Broad", meaning: "Rộng lớn", type: "adj", explanation: "Rộng, bao quát nhiều phạm vi hoặc nhiều chủ đề.", example: "The course gives a ______ overview of economics." },
  { test: "Cam 16 Test 2", vocab: "Objectivity", meaning: "Khách quan", type: "n", explanation: "Tính dựa trên sự thật, không bị cảm xúc hay định kiến chi phối.", example: "Good research requires ______ and clear methods." },
  { test: "Cam 16 Test 2", vocab: "Fairness", meaning: "Công bằng", type: "n", explanation: "Sự đối xử đúng mực và không thiên vị.", example: "Employees value ______ in performance reviews." },
  { test: "Cam 16 Test 2", vocab: "Prospect", meaning: "Triển vọng", type: "n", explanation: "Khả năng hoặc cơ hội có thể xảy ra trong tương lai.", example: "There is little ______ of improvement without investment." },
  { test: "Cam 16 Test 2", vocab: "Detached", meaning: "Tách rời", type: "adj", explanation: "Tách rời hoặc không bị dính líu/cảm xúc chi phối.", example: "Try to stay ______ and evaluate the facts." },
  { test: "Cam 16 Test 2", vocab: "Egocentric", meaning: "Ích kỷ", type: "adj", explanation: "Chỉ tập trung vào bản thân, coi mình là trung tâm.", example: "An ______ attitude can damage teamwork." },
  { test: "Cam 16 Test 2", vocab: "Generalize", meaning: "Nói chung chung", type: "v", explanation: "Rút ra kết luận chung từ một số trường hợp.", example: "Don’t ______ from one bad experience." },
  { test: "Cam 16 Test 2", vocab: "Retaliation", meaning: "Trả thù", type: "n", explanation: "Hành động đáp trả để gây hại lại sau khi bị đối xử tệ.", example: "The company prohibits ______ in the workplace." },
  { test: "Cam 16 Test 2", vocab: "Conventional", meaning: "Thông thường", type: "adj", explanation: "Theo cách truyền thống, phổ biến và được chấp nhận rộng rãi.", example: "They chose a ______ approach instead of taking risks." },

  // Cam 16 Test 3
  { test: "Cam 16 Test 3", vocab: "Conquer", meaning: "Chinh phục", type: "v", explanation: "Chiếm được hoặc vượt qua một nơi/thử thách bằng nỗ lực hay sức mạnh.", example: "She worked hard to ______ her fear of public speaking." },
  { test: "Cam 16 Test 3", vocab: "Pass on to", meaning: "Truyền lại", type: "v", explanation: "Chuyển giao thứ gì đó (kiến thức, đồ vật, thông tin) cho người khác.", example: "Parents often ______ traditions to their children." },
  { test: "Cam 16 Test 3", vocab: "Stitch", meaning: "Đính, đơm", type: "v", explanation: "Khâu vá hoặc nối vải/da lại bằng chỉ.", example: "The nurse had to ______ the wound carefully." },
  { test: "Cam 16 Test 3", vocab: "Mediterranean", meaning: "Địa Trung Hải", type: "adj", explanation: "Liên quan đến khu vực/khí hậu/văn hoá quanh Địa Trung Hải.", example: "Olive trees thrive in a ______ climate." },
  { test: "Cam 16 Test 3", vocab: "Involve", meaning: "Liên quan", type: "v", explanation: "Bao gồm như một phần cần thiết hoặc khiến ai đó tham gia.", example: "The job may ______ working on weekends." },
  { test: "Cam 16 Test 3", vocab: "Consist", meaning: "Bao gồm", type: "v", explanation: "Được tạo thành từ các phần/thành phần nhất định.", example: "The course ______ of weekly lectures and projects." },
  { test: "Cam 16 Test 3", vocab: "Contrary", meaning: "Trái ngược", type: "adj", explanation: "Hoàn toàn khác hoặc đối lập với điều đã nói/kỳ vọng.", example: "Contrary to expectations, sales increased." },
  { test: "Cam 16 Test 3", vocab: "Pierce", meaning: "Chọc thủng", type: "v", explanation: "Đâm xuyên qua để tạo lỗ hoặc đi xuyên qua vật thể.", example: "A sharp object can ______ the thin plastic easily." },
  { test: "Cam 16 Test 3", vocab: "Interior", meaning: "Phần bên trong", type: "n", explanation: "Không gian hoặc phần nằm phía trong của vật/nhà/xe.", example: "The ______ of the cave was cold and dark." },
  { test: "Cam 16 Test 3", vocab: "Coordinate", meaning: "Điều hành", type: "v", explanation: "Tổ chức và sắp xếp các hoạt động để chúng diễn ra trơn tru.", example: "She will ______ the team’s schedule for the event." },
  { test: "Cam 16 Test 3", vocab: "Cargo", meaning: "Hàng hoá", type: "n", explanation: "Hàng được vận chuyển bằng tàu, máy bay hoặc xe tải.", example: "The ship carried ______ across the ocean." },
  { test: "Cam 16 Test 3", vocab: "Intercept", meaning: "Chặn đứng", type: "v", explanation: "Chặn và bắt/kéo lại trước khi đến đích.", example: "The security team ______ the suspicious package." },
  { test: "Cam 16 Test 3", vocab: "Merchant", meaning: "Thương gia", type: "n", explanation: "Người buôn bán hàng hoá, thường ở quy mô tương đối lớn.", example: "A local ______ traded spices and silk." },
  { test: "Cam 16 Test 3", vocab: "Steer", meaning: "Điều hướng", type: "v", explanation: "Điều khiển hướng đi của phương tiện hoặc dẫn dắt theo hướng nhất định.", example: "He ______ the boat away from the rocks." },
  { test: "Cam 16 Test 3", vocab: "Route", meaning: "Tuyến đường", type: "n", explanation: "Đường đi được định sẵn để di chuyển từ nơi này đến nơi khác.", example: "They chose the safest ______ through the mountains." },
  { test: "Cam 16 Test 3", vocab: "Sophisticated", meaning: "Tinh vi phức tạp", type: "adj", explanation: "Phức tạp và phát triển cao, thường có tính hiện đại/tinh xảo.", example: "The lab uses ______ equipment for analysis." },
  { test: "Cam 16 Test 3", vocab: "Inherit", meaning: "Kế thừa", type: "v", explanation: "Nhận tài sản/đặc điểm từ thế hệ trước hoặc người đi trước.", example: "She may ______ the family business one day." },
  { test: "Cam 16 Test 3", vocab: "Initially", meaning: "Lúc đầu", type: "adv", explanation: "Ở giai đoạn ban đầu, trước khi có thay đổi.", example: "______ the plan seemed impossible, but it worked." },
  { test: "Cam 16 Test 3", vocab: "Cripple", meaning: "Phá hỏng", type: "v", explanation: "Gây thiệt hại nghiêm trọng làm giảm mạnh khả năng hoạt động.", example: "A cyberattack can ______ an entire network." },
  { test: "Cam 16 Test 3", vocab: "Expose", meaning: "Tiếp xúc", type: "v", explanation: "Khiến ai đó/cái gì đó bị đặt trong tình trạng chịu tác động của một yếu tố.", example: "Do not ______ the chemical to direct sunlight." },
  { test: "Cam 16 Test 3", vocab: "Supersede", meaning: "Thay thế", type: "v", explanation: "Thay thế thứ cũ bằng thứ mới có hiệu lực/ưu tiên hơn.", example: "Digital records have ______ many paper files." },
  { test: "Cam 16 Test 3", vocab: "Phenomenon", meaning: "Hiện tượng", type: "n", explanation: "Sự việc có thể quan sát được, thường đáng chú ý hoặc có tính khoa học.", example: "Auroras are a natural ______ seen near the poles." },
  { test: "Cam 16 Test 3", vocab: "Facilitate", meaning: "Tạo điều kiện", type: "v", explanation: "Giúp cho việc gì đó dễ xảy ra hoặc thuận lợi hơn.", example: "Good tools can ______ faster learning." },
  { test: "Cam 16 Test 3", vocab: "Resemble", meaning: "Tạo hình giống nhau", type: "v", explanation: "Trông giống hoặc có đặc điểm tương tự.", example: "The child strongly ______ her mother." },
  { test: "Cam 16 Test 3", vocab: "Vanish", meaning: "Biến mất", type: "v", explanation: "Biến mất hoàn toàn hoặc không còn nhìn thấy nữa.", example: "The fog began to ______ as the sun rose." },
  { test: "Cam 16 Test 3", vocab: "Thaw out", meaning: "Tan", type: "v", explanation: "Rã đông; làm cho băng/đồ đông lạnh trở lại trạng thái bình thường.", example: "Leave the meat to ______ before cooking." },
  { test: "Cam 16 Test 3", vocab: "Degradation", meaning: "Sự xuống cấp", type: "n", explanation: "Quá trình chất lượng bị giảm dần hoặc vật liệu bị hư hại.", example: "Air pollution can cause stone ______ over time." },
  { test: "Cam 16 Test 3", vocab: "Stationary", meaning: "Tĩnh, không di chuyển", type: "adj", explanation: "Đứng yên, không chuyển động.", example: "The vehicle remained ______ at the red light." },
  { test: "Cam 16 Test 3", vocab: "Traverse", meaning: "Băng qua, đi qua", type: "v", explanation: "Đi qua một khu vực, thường là quãng đường dài/khó.", example: "They had to ______ rough terrain to reach the village." },
  { test: "Cam 16 Test 3", vocab: "Retreat", meaning: "Rút lui", type: "v", explanation: "Di chuyển lùi lại hoặc rút khỏi vị trí vì nguy hiểm/áp lực.", example: "The troops were forced to ______ after heavy losses." },
  { test: "Cam 16 Test 3", vocab: "Disintegrate", meaning: "Tan rã, phân huỷ", type: "v", explanation: "Vỡ vụn hoặc tách rời thành nhiều phần nhỏ.", example: "The old paper began to ______ when touched." },
  { test: "Cam 16 Test 3", vocab: "Artefact", meaning: "Đồ tạo tác", type: "n", explanation: "Hiện vật do con người tạo ra, thường có giá trị lịch sử.", example: "The museum displayed an ancient ______ made of bronze." },
  { test: "Cam 16 Test 3", vocab: "Shrink", meaning: "Thu lại, co lại", type: "v", explanation: "Giảm kích thước hoặc số lượng.", example: "Wool can ______ if washed in hot water." },
  { test: "Cam 16 Test 3", vocab: "Preserve", meaning: "Bảo quản, giữ gìn", type: "v", explanation: "Giữ cho thứ gì đó không bị hỏng, bị mất hoặc bị thay đổi.", example: "Salt was used to ______ food before refrigeration." },
  { test: "Cam 16 Test 3", vocab: "Fragile", meaning: "Mong manh", type: "adj", explanation: "Dễ vỡ hoặc dễ hư hại.", example: "Handle the glass carefully—it’s ______." },
  { test: "Cam 16 Test 3", vocab: "Expose", meaning: "Phơi bày", type: "v", explanation: "Làm lộ ra hoặc khiến bị nhìn thấy/biết đến; để lộ trước tác động.", example: "The investigation may ______ serious corruption." },
  { test: "Cam 16 Test 3", vocab: "Decay", meaning: "Phân rã", type: "v", explanation: "Bị mục nát hoặc phân huỷ theo thời gian.", example: "Leaves ______ quickly in warm, wet conditions." },
  { test: "Cam 16 Test 3", vocab: "Congregate", meaning: "Tụ họp", type: "v", explanation: "Tập trung lại thành một nhóm ở cùng một nơi.", example: "Birds ______ near the lake at dusk." },
  { test: "Cam 16 Test 3", vocab: "Settlement", meaning: "Khu định cư", type: "n", explanation: "Nơi con người sinh sống và hình thành cộng đồng.", example: "Archaeologists found traces of an early ______." },
  { test: "Cam 16 Test 3", vocab: "Radiocarbon dating", meaning: "Định tuổi carbon", type: "n", explanation: "Phương pháp xác định tuổi của vật hữu cơ dựa trên đồng vị carbon phóng xạ.", example: "They used ______ to estimate the age of the bone." },
  { test: "Cam 16 Test 3", vocab: "Apparently", meaning: "Rõ ràng", type: "adv", explanation: "Có vẻ như đúng dựa trên những gì quan sát được.", example: "______ the train was delayed due to bad weather." },
  { test: "Cam 16 Test 3", vocab: "Primarily", meaning: "Chủ yếu", type: "adv", explanation: "Phần lớn hoặc chủ đạo là như vậy.", example: "The program is ______ designed for beginners." },
  { test: "Cam 16 Test 3", vocab: "Thermometer", meaning: "Nhiệt kế", type: "n", explanation: "Dụng cụ đo nhiệt độ.", example: "The nurse checked his temperature with a ______." },
  { test: "Cam 16 Test 3", vocab: "Molecule", meaning: "Phân tử", type: "n", explanation: "Đơn vị nhỏ gồm các nguyên tử liên kết, tạo nên chất.", example: "Water is made of two hydrogen atoms and one oxygen ______." },
  { test: "Cam 16 Test 3", vocab: "Yield", meaning: "Sản lượng", type: "n", explanation: "Lượng sản phẩm thu được, đặc biệt trong nông nghiệp/sản xuất.", example: "Better irrigation increased the crop ______." },
  { test: "Cam 16 Test 3", vocab: "Thermal", meaning: "Liên quan đến nhiệt", type: "adj", explanation: "Có liên quan đến nhiệt độ hoặc nhiệt năng.", example: "The building uses ______ insulation to save energy." },
  { test: "Cam 16 Test 3", vocab: "Shade", meaning: "Bóng râm", type: "n", explanation: "Vùng tối do bị che ánh sáng mặt trời/nguồn sáng.", example: "We sat in the ______ to avoid the heat." },
  { test: "Cam 16 Test 3", vocab: "Accelerate", meaning: "Gia tăng", type: "v", explanation: "Tăng tốc hoặc làm cho diễn ra nhanh hơn.", example: "Strong winds can ______ the spread of fire." },
  { test: "Cam 16 Test 3", vocab: "Reversion", meaning: "Sự trở lại", type: "n", explanation: "Sự quay trở lại trạng thái cũ hoặc cách làm cũ.", example: "There was a ______ to traditional methods after the failure." },
  { test: "Cam 16 Test 3", vocab: "Detach", meaning: "Tháo ra", type: "v", explanation: "Tách rời khỏi vật khác; tháo ra khỏi vị trí gắn kết.", example: "Carefully ______ the cable before moving the device." },
  { test: "Cam 16 Test 3", vocab: "Culmination", meaning: "Kết quả", type: "n", explanation: "Điểm kết thúc quan trọng nhất, kết quả sau một quá trình dài.", example: "The award was the ______ of years of hard work." },
  { test: "Cam 16 Test 3", vocab: "Dictate", meaning: "Thao túng", type: "v", explanation: "Ra lệnh/áp đặt điều gì đó; quyết định một cách mạnh mẽ.", example: "Market demand often ______ what companies produce." },
  { test: "Cam 16 Test 3", vocab: "Pinpoint", meaning: "Xác định chính xác", type: "v", explanation: "Xác định đúng vị trí/nguồn gốc/nguyên nhân một cách rất chính xác.", example: "Analysts tried to ______ the source of the error." },
  { test: "Cam 16 Test 3", vocab: "Precise", meaning: "Chính xác", type: "adj", explanation: "Rõ ràng, đúng tuyệt đối, không mơ hồ.", example: "Please give a ______ time for the meeting." },

  // Cam 16 Test 4
  { test: "Cam 16 Test 4", vocab: "Canal", meaning: "Kênh, sông đào", type: "n", explanation: "Đường dẫn nước nhân tạo được xây dựng để vận chuyển nước hoặc tàu thuyền.", example: "Ancient engineers built a ______ to bring water into the city." },
  { test: "Cam 16 Test 4", vocab: "Ventilation", meaning: "Sự thông gió", type: "n", explanation: "Quá trình cung cấp không khí tươi và loại bỏ không khí cũ trong không gian kín.", example: "Proper ______ was necessary for workers digging underground tunnels." },
  { test: "Cam 16 Test 4", vocab: "Lid", meaning: "Nắp, vung", type: "n", explanation: "Vật dùng để che hoặc đậy phần trên của một vật chứa.", example: "He placed a stone ______ over the opening of the shaft." },
  { test: "Cam 16 Test 4", vocab: "Carry out", meaning: "Tiến hành", type: "phrasal verb", explanation: "Thực hiện một kế hoạch, nhiệm vụ hoặc hoạt động.", example: "The engineers carefully ______ the construction plan." },
  { test: "Cam 16 Test 4", vocab: "Geometry", meaning: "Hình học", type: "n", explanation: "Nhánh toán học nghiên cứu hình dạng, kích thước và vị trí của các vật thể.", example: "Roman engineers relied on ______ to align tunnels accurately." },
  { test: "Cam 16 Test 4", vocab: "Encounter", meaning: "Gặp phải", type: "v", explanation: "Tình cờ gặp hoặc đối mặt với điều gì đó.", example: "Workers often ______ hard rock while digging." },
  { test: "Cam 16 Test 4", vocab: "Deviation", meaning: "Sự lệch hướng", type: "n", explanation: "Sự sai lệch khỏi hướng hoặc kế hoạch ban đầu.", example: "Even a small ______ could cause the tunnels to miss each other." },
  { test: "Cam 16 Test 4", vocab: "Penetrate", meaning: "Xuyên qua", type: "v", explanation: "Đi vào hoặc xuyên qua một vật thể hoặc khu vực.", example: "The tunnel finally ______ the mountain wall." },
  { test: "Cam 16 Test 4", vocab: "Inscription", meaning: "Dòng chữ khắc", type: "n", explanation: "Chữ hoặc ký hiệu được khắc trên đá hoặc kim loại.", example: "An ancient ______ was carved into the wall." },
  { test: "Cam 16 Test 4", vocab: "Aqueduct", meaning: "Cầu dẫn nước", type: "n", explanation: "Công trình dẫn nước lớn dùng để vận chuyển nước từ nơi này đến nơi khác.", example: "The Romans built an ______ to transport water into the city." },
  { test: "Cam 16 Test 4", vocab: "Corridor", meaning: "Hành lang", type: "n", explanation: "Lối đi dài và hẹp nối các khu vực.", example: "The underground tunnel formed a narrow ______." },
  { test: "Cam 16 Test 4", vocab: "Trace", meaning: "Dấu vết", type: "n", explanation: "Một dấu hiệu nhỏ còn lại của thứ gì đó.", example: "Archaeologists found ______ of ancient tools." },
  { test: "Cam 16 Test 4", vocab: "Sole", meaning: "Duy nhất", type: "adj", explanation: "Là cái duy nhất, không có cái thứ hai.", example: "This aqueduct was the ______ water source for the town." },
  { test: "Cam 16 Test 4", vocab: "Extraction", meaning: "Sự khai thác", type: "n", explanation: "Quá trình lấy hoặc tách một thứ ra khỏi nơi chứa.", example: "The tunnel allowed the ______ of minerals." },
  { test: "Cam 16 Test 4", vocab: "Patron", meaning: "Người bảo trợ", type: "n", explanation: "Người hỗ trợ tài chính cho một dự án hoặc tổ chức.", example: "A wealthy ______ funded the construction." },
  { test: "Cam 16 Test 4", vocab: "Divert", meaning: "Chuyển hướng", type: "v", explanation: "Làm thay đổi hướng của dòng nước hoặc đường đi.", example: "Engineers had to ______ the river temporarily." },
  { test: "Cam 16 Test 4", vocab: "Civilization", meaning: "Nền văn minh", type: "n", explanation: "Một xã hội phát triển với hệ thống văn hóa và công nghệ phức tạp.", example: "These tunnels show the engineering skills of ancient ______." },
  { test: "Cam 16 Test 4", vocab: "Territory", meaning: "Lãnh thổ", type: "n", explanation: "Một khu vực đất đai thuộc quyền kiểm soát của một quốc gia hoặc nhóm.", example: "The aqueduct supplied water across a large ______." },
  { test: "Cam 16 Test 4", vocab: "Slope", meaning: "Độ dốc", type: "n", explanation: "Mức độ nghiêng của một bề mặt.", example: "Engineers calculated the ______ carefully so water could flow." },
  { test: "Cam 16 Test 4", vocab: "Drain", meaning: "Thoát nước", type: "v", explanation: "Làm cho nước hoặc chất lỏng chảy ra khỏi một khu vực.", example: "The tunnel helped ______ excess water." },
  { test: "Cam 16 Test 4", vocab: "Pursue", meaning: "Theo đuổi", type: "v", explanation: "Tiếp tục thực hiện hoặc cố gắng đạt được một mục tiêu.", example: "They continued to ______ the project despite difficulties." },
  { test: "Cam 16 Test 4", vocab: "Shaft", meaning: "Giếng đứng", type: "n", explanation: "Lối đi thẳng đứng nối mặt đất với đường hầm.", example: "Workers descended the ______ to reach the tunnel." },
  { test: "Cam 16 Test 4", vocab: "Youngster", meaning: "Thanh niên", type: "n", explanation: "Người trẻ tuổi, đặc biệt là trẻ em hoặc thanh thiếu niên.", example: "Many ______ today grow up using digital devices." },
  { test: "Cam 16 Test 4", vocab: "Pacifier", meaning: "Núm vú giả", type: "n", explanation: "Vật cho trẻ nhỏ ngậm để làm dịu.", example: "The baby stopped crying after receiving a ______." },
  { test: "Cam 16 Test 4", vocab: "Toddler", meaning: "Trẻ mới biết đi", type: "n", explanation: "Đứa trẻ khoảng 1–3 tuổi.", example: "The ______ was learning how to walk steadily." },
  { test: "Cam 16 Test 4", vocab: "Hunch", meaning: "Khom người", type: "v", explanation: "Cong lưng hoặc khom người về phía trước.", example: "He ______ over his phone while reading." },
  { test: "Cam 16 Test 4", vocab: "Underlie", meaning: "Làm nền tảng", type: "v", explanation: "Là cơ sở hoặc nguyên nhân cơ bản của điều gì đó.", example: "Many assumptions ______ modern reading theories." },
  { test: "Cam 16 Test 4", vocab: "Subtly", meaning: "Một cách tinh vi", type: "adv", explanation: "Theo cách nhẹ nhàng hoặc khó nhận ra.", example: "Technology has ______ changed reading habits." },
  { test: "Cam 16 Test 4", vocab: "Implication", meaning: "Hệ quả", type: "n", explanation: "Kết quả hoặc ảnh hưởng có thể xảy ra.", example: "The study has important ______ for education." },
  { test: "Cam 16 Test 4", vocab: "Scholar", meaning: "Học giả", type: "n", explanation: "Người nghiên cứu chuyên sâu trong một lĩnh vực.", example: "The ______ published a paper about literacy." },
  { test: "Cam 16 Test 4", vocab: "Disrupt", meaning: "Làm gián đoạn", type: "v", explanation: "Làm gián đoạn hoạt động bình thường.", example: "Constant notifications ______ concentration." },
  { test: "Cam 16 Test 4", vocab: "Diminish", meaning: "Giảm", type: "v", explanation: "Làm giảm số lượng hoặc cường độ.", example: "Excessive screen time may ______ deep reading ability." },
  { test: "Cam 16 Test 4", vocab: "Confront", meaning: "Đối mặt", type: "v", explanation: "Đối diện với vấn đề hoặc tình huống khó khăn.", example: "Students must ______ complex texts." },
  { test: "Cam 16 Test 4", vocab: "Inborn", meaning: "Bẩm sinh", type: "adj", explanation: "Có sẵn từ khi sinh ra.", example: "Reading is not entirely an ______ skill." },
  { test: "Cam 16 Test 4", vocab: "Comprehension", meaning: "Sự hiểu", type: "n", explanation: "Khả năng hiểu thông tin.", example: "Reading ______ improves with practice." },
  { test: "Cam 16 Test 4", vocab: "Plot", meaning: "Cốt truyện", type: "n", explanation: "Chuỗi sự kiện chính của một câu chuyện.", example: "The novel has a complex ______." },
  { test: "Cam 16 Test 4", vocab: "Browse", meaning: "Đọc lướt", type: "v", explanation: "Xem nhanh thông tin mà không đọc kỹ.", example: "Many people ______ articles online instead of reading deeply." },
  { test: "Cam 16 Test 4", vocab: "Superficial", meaning: "Hời hợt", type: "adj", explanation: "Thiếu chiều sâu hoặc sự hiểu biết sâu sắc.", example: "Quick reading can lead to ______ understanding." },
  { test: "Cam 16 Test 4", vocab: "Allocate", meaning: "Phân bổ", type: "v", explanation: "Chia hoặc phân phát nguồn lực cho mục đích cụ thể.", example: "Students should ______ time for deep reading." },
  { test: "Cam 16 Test 4", vocab: "Grasp", meaning: "Nắm bắt", type: "v", explanation: "Hiểu đầy đủ một ý tưởng.", example: "It took time to ______ the theory." },
  { test: "Cam 16 Test 4", vocab: "Perceive", meaning: "Nhận thức", type: "v", explanation: "Nhìn nhận hoặc hiểu điều gì đó.", example: "People ______ information differently." },
  { test: "Cam 16 Test 4", vocab: "Neuroscience", meaning: "Khoa học thần kinh", type: "n", explanation: "Lĩnh vực nghiên cứu hệ thần kinh và não bộ.", example: "Modern ______ studies reading processes." },
  { test: "Cam 16 Test 4", vocab: "Rectify", meaning: "Sửa chữa", type: "v", explanation: "Sửa lỗi hoặc điều chỉnh cho đúng.", example: "Teachers help ______ reading mistakes." },
  { test: "Cam 16 Test 4", vocab: "Possess", meaning: "Sở hữu", type: "v", explanation: "Có hoặc nắm giữ một thứ gì đó.", example: "Humans ______ advanced cognitive abilities." },
  { test: "Cam 16 Test 4", vocab: "Entrench", meaning: "Bén rễ sâu", type: "v", explanation: "Thiết lập vững chắc và khó thay đổi.", example: "Habits can become deeply ______." },
  { test: "Cam 16 Test 4", vocab: "Literacy", meaning: "Đọc viết", type: "n", explanation: "Khả năng đọc và viết hiệu quả.", example: "Education programs aim to improve ______ rates." },
  { test: "Cam 16 Test 4", vocab: "Decode", meaning: "Giải mã", type: "v", explanation: "Hiểu hoặc chuyển đổi thông tin từ dạng mã.", example: "Children learn to ______ written words." },
  { test: "Cam 16 Test 4", vocab: "Inference", meaning: "Suy luận", type: "n", explanation: "Kết luận rút ra từ bằng chứng.", example: "Readers make ______ from context." },
  { test: "Cam 16 Test 4", vocab: "Cognitive", meaning: "Nhận thức", type: "adj", explanation: "Liên quan đến quá trình suy nghĩ và hiểu biết.", example: "Reading strengthens ______ abilities." },
  { test: "Cam 16 Test 4", vocab: "Comprehend", meaning: "Hiểu", type: "v", explanation: "Hiểu hoàn toàn một ý tưởng.", example: "Students must ______ complex arguments." },
  { test: "Cam 16 Test 4", vocab: "Bombardment", meaning: "Sự dồn dập", type: "n", explanation: "Sự tấn công liên tục bằng thông tin hoặc tín hiệu.", example: "People face a ______ of online information." },
  { test: "Cam 16 Test 4", vocab: "Susceptible", meaning: "Dễ ảnh hưởng", type: "adj", explanation: "Dễ bị tác động bởi điều gì đó.", example: "Young readers are ______ to digital distractions." },
  { test: "Cam 16 Test 4", vocab: "Irrational", meaning: "Phi lý", type: "adj", explanation: "Không dựa trên logic hoặc lý trí.", example: "Fear of technology can sometimes be ______." },
  { test: "Cam 16 Test 4", vocab: "Imply", meaning: "Ám chỉ", type: "v", explanation: "Gợi ý điều gì đó mà không nói trực tiếp.", example: "His tone seemed to ______ criticism." },
  { test: "Cam 16 Test 4", vocab: "Superiority", meaning: "Sự vượt trội", type: "n", explanation: "Trạng thái tốt hơn hoặc mạnh hơn.", example: "Some believe human judgment shows ______ over machines." },
  { test: "Cam 16 Test 4", vocab: "Predict", meaning: "Dự đoán", type: "v", explanation: "Nói trước điều gì sẽ xảy ra.", example: "AI systems can ______ diseases earlier." },
  { test: "Cam 16 Test 4", vocab: "Reluctant", meaning: "Miễn cưỡng", type: "adj", explanation: "Không sẵn lòng làm điều gì.", example: "Some doctors are ______ to rely on AI." },
  { test: "Cam 16 Test 4", vocab: "Distrust", meaning: "Sự nghi ngờ", type: "n", explanation: "Thiếu niềm tin vào ai đó hoặc điều gì đó.", example: "There is still ______ toward automated decisions." },
  { test: "Cam 16 Test 4", vocab: "Coincide", meaning: "Trùng hợp", type: "v", explanation: "Xảy ra cùng lúc hoặc tương ứng.", example: "The results ______ with previous research." },
  { test: "Cam 16 Test 4", vocab: "Physician", meaning: "Bác sĩ", type: "n", explanation: "Bác sĩ chuyên điều trị bệnh.", example: "A skilled ______ analyzed the diagnosis." },
  { test: "Cam 16 Test 4", vocab: "Competent", meaning: "Có năng lực", type: "adj", explanation: "Có đủ kỹ năng để làm việc hiệu quả.", example: "The AI system proved highly ______." },
  { test: "Cam 16 Test 4", vocab: "Plausible", meaning: "Hợp lý", type: "adj", explanation: "Có vẻ đáng tin và có khả năng đúng.", example: "The explanation seemed ______." },
  { test: "Cam 16 Test 4", vocab: "Suspicion", meaning: "Sự nghi ngờ", type: "n", explanation: "Cảm giác rằng điều gì đó không đúng.", example: "The decision raised public ______." },
  { test: "Cam 16 Test 4", vocab: "Expertise", meaning: "Chuyên môn", type: "n", explanation: "Kiến thức hoặc kỹ năng chuyên sâu.", example: "Doctors rely on years of ______." },
  { test: "Cam 16 Test 4", vocab: "Foolproof", meaning: "Không thể sai", type: "adj", explanation: "Rất dễ sử dụng và không dễ mắc lỗi.", example: "No system is completely ______." },
  { test: "Cam 16 Test 4", vocab: "Disproportionate", meaning: "Không cân xứng", type: "adj", explanation: "Không tương xứng về quy mô hoặc mức độ.", example: "People sometimes fear technology to a ______ degree." },
  { test: "Cam 16 Test 4", vocab: "Divergence", meaning: "Sự khác biệt", type: "n", explanation: "Sự tách ra hoặc khác biệt giữa các quan điểm.", example: "There is a clear ______ between experts and the public." },
  { test: "Cam 16 Test 4", vocab: "Polarise", meaning: "Phân cực", type: "v", explanation: "Chia một nhóm thành hai phe đối lập.", example: "Debates about AI often ______ opinions." },
  { test: "Cam 16 Test 4", vocab: "Optimist", meaning: "Người lạc quan", type: "n", explanation: "Người tin rằng điều tốt đẹp sẽ xảy ra.", example: "An ______ believes technology will help humanity." },
  { test: "Cam 16 Test 4", vocab: "Sceptic", meaning: "Người hoài nghi", type: "n", explanation: "Người nghi ngờ tính đúng đắn của điều gì đó.", example: "A ______ questions the reliability of AI." },
  { test: "Cam 16 Test 4", vocab: "Surveillance", meaning: "Giám sát", type: "n", explanation: "Theo dõi chặt chẽ hành vi hoặc hoạt động.", example: "AI is widely used for security ______." },
  { test: "Cam 16 Test 4", vocab: "Disclosure", meaning: "Sự tiết lộ", type: "n", explanation: "Hành động công khai thông tin.", example: "The law requires full ______ of data use." },
  { test: "Cam 16 Test 4", vocab: "Phenomenon", meaning: "Hiện tượng", type: "n", explanation: "Một sự kiện hoặc tình huống có thể quan sát được.", example: "AI adoption is a global ______." },
  { test: "Cam 16 Test 4", vocab: "Devote", meaning: "Cống hiến", type: "v", explanation: "Dành thời gian hoặc công sức cho điều gì đó.", example: "Researchers ______ years to developing new algorithms." },
  { test: "Cam 16 Test 4", vocab: "Portrayal", meaning: "Sự miêu tả", type: "n", explanation: "Cách một người hoặc ý tưởng được thể hiện.", example: "Movies often exaggerate the ______ of AI." },

  // Cam 19 Test 1
  { test: "Cam 19 Test 1", vocab: "Publicise", meaning: "Công khai", type: "v", explanation: "Làm cho thông tin trở nên công khai và được nhiều người biết đến.", example: "The company decided to ______ its new product." },
  { test: "Cam 19 Test 1", vocab: "Subtle", meaning: "Tinh tế", type: "adj", explanation: "Khó nhận ra, không rõ ràng nhưng có ý nghĩa quan trọng.", example: "There are ______ differences between the two results." },
  { test: "Cam 19 Test 1", vocab: "Synthetic", meaning: "Tổng hợp", type: "adj", explanation: "Được tạo ra nhân tạo thay vì tự nhiên.", example: "The material is made from ______ fibers." },
  { test: "Cam 19 Test 1", vocab: "Tweak", meaning: "Điều chỉnh nhẹ", type: "v", explanation: "Thay đổi nhỏ để cải thiện hiệu suất.", example: "Engineers ______ the system to improve accuracy." },
  { test: "Cam 19 Test 1", vocab: "Maximisation of competitive advantage", meaning: "Tối đa hoá lợi thế", type: "n", explanation: "Quá trình tăng cường lợi thế để vượt đối thủ.", example: "Firms focus on ______ in global markets." },
  { test: "Cam 19 Test 1", vocab: "Regularity", meaning: "Sự đều đặn", type: "n", explanation: "Tính lặp lại ổn định theo thời gian.", example: "Exercise should be done with ______." },
  { test: "Cam 19 Test 1", vocab: "Intestine", meaning: "Ruột", type: "n", explanation: "Cơ quan tiêu hóa giúp hấp thụ chất dinh dưỡng.", example: "Food passes through the ______ during digestion." },
  { test: "Cam 19 Test 1", vocab: "Revolutionise", meaning: "Cách mạng hoá", type: "v", explanation: "Thay đổi hoàn toàn cách một hệ thống hoạt động.", example: "Technology can ______ healthcare systems." },
  { test: "Cam 19 Test 1", vocab: "Mould", meaning: "Khuôn / đúc", type: "v", explanation: "Tạo hình hoặc định hình một vật.", example: "Workers ______ the material into shape." },
  { test: "Cam 19 Test 1", vocab: "Misfit", meaning: "Kẻ lạc lõng", type: "n", explanation: "Người không phù hợp với môi trường xã hội.", example: "He felt like a ______ in the new school." },
  { test: "Cam 19 Test 1", vocab: "Daredevil", meaning: "Người liều lĩnh", type: "n", explanation: "Người thích làm những việc nguy hiểm.", example: "The ______ performed risky stunts." },
  { test: "Cam 19 Test 1", vocab: "Swashbuckler", meaning: "Kiếm khách", type: "n", explanation: "Nhân vật phiêu lưu, thường gắn với đấu kiếm.", example: "The film featured a heroic ______." },
  { test: "Cam 19 Test 1", vocab: "Spread fear", meaning: "Gieo rắc nỗi sợ", type: "v", explanation: "Làm cho nhiều người cảm thấy sợ hãi.", example: "False news can ______ among the public." },
  { test: "Cam 19 Test 1", vocab: "Threaten the interests", meaning: "Đe doạ lợi ích", type: "v", explanation: "Gây nguy hiểm cho quyền lợi của ai đó.", example: "The policy may ______ of local businesses." },
  { test: "Cam 19 Test 1", vocab: "Fleet", meaning: "Hạm đội", type: "n", explanation: "Một nhóm tàu hoặc phương tiện lớn.", example: "The navy deployed a ______ of ships." },
  { test: "Cam 19 Test 1", vocab: "Predate", meaning: "Có trước", type: "v", explanation: "Xảy ra trước một sự kiện khác.", example: "The tradition ______ modern society." },
  { test: "Cam 19 Test 1", vocab: "Civilisation", meaning: "Nền văn minh", type: "n", explanation: "Xã hội phát triển với hệ thống văn hóa và tổ chức.", example: "Ancient ______ built complex cities." },
  { test: "Cam 19 Test 1", vocab: "Predominantly", meaning: "Chủ yếu", type: "adv", explanation: "Phần lớn hoặc chủ yếu.", example: "The region is ______ rural." },
  { test: "Cam 19 Test 1", vocab: "Hilly", meaning: "Nhiều đồi", type: "adj", explanation: "Có nhiều đồi hoặc địa hình gồ ghề.", example: "The area is ______ and difficult to travel." },
  { test: "Cam 19 Test 1", vocab: "Unsurpassed", meaning: "Vô song", type: "adj", explanation: "Không ai vượt qua được.", example: "Her skill remains ______." },
  { test: "Cam 19 Test 1", vocab: "Cove", meaning: "Vịnh nhỏ", type: "n", explanation: "Một vịnh nhỏ kín gió.", example: "The boats anchored in a quiet ______." },
  { test: "Cam 19 Test 1", vocab: "Navigable route", meaning: "Đường đi lại được", type: "n", explanation: "Đường mà tàu hoặc phương tiện có thể di chuyển.", example: "The river became a ______." },
  { test: "Cam 19 Test 1", vocab: "Condone", meaning: "Dung túng", type: "v", explanation: "Chấp nhận hành vi sai trái.", example: "The school does not ______ cheating." },
  { test: "Cam 19 Test 1", vocab: "Glorify", meaning: "Tôn vinh", type: "v", explanation: "Ca ngợi quá mức.", example: "Movies sometimes ______ violence." },
  { test: "Cam 19 Test 1", vocab: "Tolerate", meaning: "Chịu đựng", type: "v", explanation: "Chấp nhận điều khó chịu.", example: "She cannot ______ loud noise." },
  { test: "Cam 19 Test 1", vocab: "Emboldened", meaning: "Được khuyến khích", type: "adj", explanation: "Trở nên táo bạo hơn.", example: "He felt ______ to speak up." },
  { test: "Cam 19 Test 1", vocab: "Dignitary", meaning: "Người có chức vị", type: "n", explanation: "Người quan trọng trong xã hội.", example: "The event welcomed foreign ______." },
  { test: "Cam 19 Test 1", vocab: "Dignity", meaning: "Phẩm giá", type: "n", explanation: "Sự tôn trọng bản thân.", example: "She handled the situation with ______." },
  { test: "Cam 19 Test 1", vocab: "Ransom", meaning: "Tiền chuộc", type: "n", explanation: "Tiền trả để giải cứu con tin.", example: "They demanded a ______." },
  { test: "Cam 19 Test 1", vocab: "Hostage", meaning: "Con tin", type: "n", explanation: "Người bị bắt để gây áp lực.", example: "The criminals took a ______." },
  { test: "Cam 19 Test 1", vocab: "Eradicate", meaning: "Diệt trừ", type: "v", explanation: "Loại bỏ hoàn toàn.", example: "Efforts aim to ______ the disease." },
  { test: "Cam 19 Test 1", vocab: "Peril of something", meaning: "Nguy hiểm", type: "n", explanation: "Mối nguy hoặc rủi ro.", example: "They faced the ______ of climate change." },
  { test: "Cam 19 Test 1", vocab: "Battle falsehoods", meaning: "Chống lại sai lầm", type: "v", explanation: "Đấu tranh chống thông tin sai.", example: "Media must ______." },
  { test: "Cam 19 Test 1", vocab: "Falsehood", meaning: "Sai lầm", type: "n", explanation: "Điều không đúng sự thật.", example: "The article contained many ______." },
  { test: "Cam 19 Test 1", vocab: "Deliberate", meaning: "Cố ý", type: "v", explanation: "Thực hiện có chủ đích.", example: "The error was ______." },
  { test: "Cam 19 Test 1", vocab: "Inevitable", meaning: "Không thể tránh", type: "adj", explanation: "Chắc chắn sẽ xảy ra.", example: "Change is ______." },
  { test: "Cam 19 Test 1", vocab: "Deceive", meaning: "Lừa dối", type: "v", explanation: "Làm ai tin điều sai.", example: "The scam aimed to ______ customers." },
  { test: "Cam 19 Test 1", vocab: "Inadvertently", meaning: "Vô tình", type: "adv", explanation: "Không cố ý.", example: "He ______ revealed the secret." },
  { test: "Cam 19 Test 1", vocab: "Advertent", meaning: "Cố ý", type: "adj", explanation: "Có ý thức và chủ đích.", example: "The action was ______." },
  { test: "Cam 19 Test 1", vocab: "Loom", meaning: "Hiện ra đe doạ", type: "v", explanation: "Xuất hiện một cách đáng lo.", example: "A crisis began to ______." },
  { test: "Cam 19 Test 1", vocab: "Unduly", meaning: "Quá mức", type: "adv", explanation: "Quá đáng hoặc không cần thiết.", example: "He was ______ worried." },
  { test: "Cam 19 Test 1", vocab: "Warrant", meaning: "Đảm bảo", type: "v", explanation: "Biện minh cho hành động.", example: "The evidence does not ______ action." },
  { test: "Cam 19 Test 1", vocab: "Resource-intensive effort", meaning: "Tốn tài nguyên", type: "n", explanation: "Hoạt động cần nhiều nguồn lực.", example: "The project is a ______." },
  { test: "Cam 19 Test 1", vocab: "Empirically", meaning: "Theo thực nghiệm", type: "adv", explanation: "Dựa trên quan sát và dữ liệu.", example: "The theory was ______ tested." },
  { test: "Cam 19 Test 1", vocab: "Skepticism", meaning: "Sự hoài nghi", type: "n", explanation: "Thái độ nghi ngờ.", example: "There was public ______ about the claim." },
  { test: "Cam 19 Test 1", vocab: "Momentarily", meaning: "Tạm thời", type: "adv", explanation: "Trong thời gian ngắn.", example: "The system failed ______." },
  { test: "Cam 19 Test 1", vocab: "Preemptively", meaning: "Phòng ngừa", type: "adv", explanation: "Hành động trước để tránh vấn đề.", example: "They acted ______ to reduce risk." },
  { test: "Cam 19 Test 1", vocab: "Comprehend", meaning: "Hiểu", type: "v", explanation: "Hiểu hoàn toàn.", example: "Students must ______ the concept." },
  { test: "Cam 19 Test 1", vocab: "Arduous", meaning: "Vất vả", type: "adj", explanation: "Đòi hỏi nhiều nỗ lực.", example: "It was an ______ task." },
  { test: "Cam 19 Test 1", vocab: "Prominence", meaning: "Sự nổi bật", type: "n", explanation: "Mức độ nổi tiếng hoặc quan trọng.", example: "The issue gained ______." },
  { test: "Cam 19 Test 1", vocab: "Sufficient", meaning: "Đủ", type: "adj", explanation: "Đáp ứng yêu cầu.", example: "There is ______ evidence." },
  { test: "Cam 19 Test 1", vocab: "Fallibility", meaning: "Khả năng mắc sai lầm", type: "n", explanation: "Khả năng phạm lỗi.", example: "Human ______ must be considered." },

  // Cam 20 Test 1
  { test: "Cam 20 Test 1", vocab: "Nesting female", meaning: "Con cái làm tổ", type: "n", explanation: "Con cái của loài chim hoặc động vật đang xây tổ và chuẩn bị sinh sản.", example: "The ______ protects her eggs carefully in the nest." },
  { test: "Cam 20 Test 1", vocab: "Feral", meaning: "Tái hoang dã", type: "adj", explanation: "Động vật từng được thuần hóa nhưng quay lại sống hoang dã.", example: "The island had many ______ cats that threatened native birds." },
  { test: "Cam 20 Test 1", vocab: "Population size", meaning: "Quy mô quần thể", type: "n", explanation: "Tổng số cá thể của một loài trong một khu vực.", example: "Scientists closely monitor the ______ of endangered species." },
  { test: "Cam 20 Test 1", vocab: "Critically endangered", meaning: "Cực kỳ nguy cấp", type: "adj", explanation: "Một loài có nguy cơ tuyệt chủng rất cao.", example: "The kakapo is considered ______." },
  { test: "Cam 20 Test 1", vocab: "Nocturnal", meaning: "Hoạt động về đêm", type: "adj", explanation: "Sinh vật chủ yếu hoạt động vào ban đêm.", example: "Owls are ______ hunters." },
  { test: "Cam 20 Test 1", vocab: "Flightless", meaning: "Không biết bay", type: "adj", explanation: "Chim hoặc động vật không có khả năng bay.", example: "The kakapo is a rare ______ parrot." },
  { test: "Cam 20 Test 1", vocab: "Solitary", meaning: "Sống đơn độc", type: "adj", explanation: "Sống một mình thay vì theo nhóm.", example: "This species is largely ______." },
  { test: "Cam 20 Test 1", vocab: "Forage", meaning: "Kiếm ăn", type: "v", explanation: "Tìm kiếm thức ăn trong tự nhiên.", example: "The birds ______ for food at night." },
  { test: "Cam 20 Test 1", vocab: "Incubation", meaning: "Sự ấp trứng", type: "n", explanation: "Quá trình giữ trứng ấm cho đến khi nở.", example: "The ______ period lasts several weeks." },
  { test: "Cam 20 Test 1", vocab: "Conservationist", meaning: "Nhà bảo tồn", type: "n", explanation: "Người làm việc để bảo vệ môi trường và các loài sinh vật.", example: "A ______ helped save the endangered bird." },
  { test: "Cam 20 Test 1", vocab: "Relocate", meaning: "Di dời", type: "v", explanation: "Chuyển người hoặc động vật đến nơi khác.", example: "Scientists decided to ______ the birds to a safer island." },
  { test: "Cam 20 Test 1", vocab: "Expedition", meaning: "Cuộc thám hiểm", type: "n", explanation: "Chuyến đi nghiên cứu hoặc khám phá có tổ chức.", example: "The research ______ lasted two months." },
  { test: "Cam 20 Test 1", vocab: "Predator-free", meaning: "Không thú săn mồi", type: "adj", explanation: "Khu vực không có loài săn mồi.", example: "The birds were moved to a ______ island." },
  { test: "Cam 20 Test 1", vocab: "Offset", meaning: "Bù đắp", type: "v", explanation: "Giảm tác động tiêu cực bằng cách cân bằng với yếu tố khác.", example: "Protection efforts helped ______ population loss." },
  { test: "Cam 20 Test 1", vocab: "Mortality", meaning: "Tỷ lệ tử vong", type: "n", explanation: "Tỷ lệ số cá thể chết trong một quần thể.", example: "Predators increased chick ______." },
  { test: "Cam 20 Test 1", vocab: "Eradicate", meaning: "Tiêu diệt hoàn toàn", type: "v", explanation: "Loại bỏ hoàn toàn một loài hoặc vấn đề.", example: "Authorities tried to ______ invasive rats." },
  { test: "Cam 20 Test 1", vocab: "Hand-raising", meaning: "Nuôi bằng tay", type: "n", explanation: "Nuôi con non trực tiếp bởi con người.", example: "Some chicks survived because of ______." },
  { test: "Cam 20 Test 1", vocab: "Genetic diversity", meaning: "Đa dạng di truyền", type: "n", explanation: "Sự đa dạng về gen trong quần thể.", example: "Maintaining ______ helps species survive." },
  { test: "Cam 20 Test 1", vocab: "Supplementary feeding", meaning: "Cho ăn bổ sung", type: "n", explanation: "Cung cấp thức ăn thêm để hỗ trợ động vật.", example: "Researchers introduced ______ to increase breeding success." },
  { test: "Cam 20 Test 1", vocab: "Cautious optimism", meaning: "Lạc quan thận trọng", type: "n", explanation: "Hy vọng nhưng vẫn giữ thái độ cẩn trọng.", example: "Scientists expressed ______ about recovery." },
  { test: "Cam 20 Test 1", vocab: "Arise from", meaning: "Phát sinh từ", type: "v", explanation: "Bắt nguồn từ điều gì đó.", example: "The problem may ______ climate change." },
  { test: "Cam 20 Test 1", vocab: "Reintroduce", meaning: "Tái thả", type: "v", explanation: "Đưa một loài trở lại môi trường tự nhiên.", example: "Scientists hope to ______ the species." },
  { test: "Cam 20 Test 1", vocab: "Bring into", meaning: "Đưa vào", type: "v", explanation: "Đưa một yếu tố hoặc ý tưởng vào hệ thống.", example: "The project aims to ______ new conservation methods." },
  { test: "Cam 20 Test 1", vocab: "Vulnerable", meaning: "Dễ tổn thương", type: "adj", explanation: "Có khả năng bị hại hoặc bị ảnh hưởng.", example: "Young trees are ______ to disease." },
  { test: "Cam 20 Test 1", vocab: "Flourish", meaning: "Phát triển mạnh", type: "v", explanation: "Phát triển khỏe mạnh và thành công.", example: "Plants ______ in the restored habitat." },
  { test: "Cam 20 Test 1", vocab: "Prominent", meaning: "Nổi bật", type: "adj", explanation: "Dễ thấy hoặc quan trọng.", example: "The scientist became a ______ figure in conservation." },
  { test: "Cam 20 Test 1", vocab: "Epidemic", meaning: "Dịch bệnh", type: "n", explanation: "Bệnh lan nhanh trong quần thể.", example: "An ______ destroyed many trees." },
  { test: "Cam 20 Test 1", vocab: "Infected", meaning: "Bị nhiễm", type: "adj", explanation: "Bị ảnh hưởng bởi bệnh.", example: "Many trees were ______ by the fungus." },
  { test: "Cam 20 Test 1", vocab: "Mature", meaning: "Trưởng thành", type: "adj", explanation: "Đạt đến giai đoạn phát triển hoàn chỉnh.", example: "The disease often kills ______ trees." },
  { test: "Cam 20 Test 1", vocab: "Susceptible", meaning: "Dễ bị ảnh hưởng", type: "adj", explanation: "Dễ bị bệnh hoặc tác động.", example: "Certain species are highly ______ to infection." },
  { test: "Cam 20 Test 1", vocab: "Resistant", meaning: "Có sức đề kháng", type: "adj", explanation: "Có khả năng chống lại bệnh.", example: "Scientists developed ______ trees." },
  { test: "Cam 20 Test 1", vocab: "Hybrid strain", meaning: "Chủng lai", type: "n", explanation: "Giống được tạo ra từ lai giữa hai giống.", example: "A ______ may survive the disease." },
  { test: "Cam 20 Test 1", vocab: "Advocate", meaning: "Người ủng hộ", type: "n", explanation: "Người công khai ủng hộ một ý tưởng.", example: "Environmental ______ supported the project." },
  { test: "Cam 20 Test 1", vocab: "Social acceptance", meaning: "Chấp nhận xã hội", type: "n", explanation: "Mức độ xã hội chấp nhận một ý tưởng.", example: "The plan requires public ______." },
  { test: "Cam 20 Test 1", vocab: "Raise questions", meaning: "Đặt câu hỏi", type: "v", explanation: "Gợi lên sự nghi ngờ hoặc thắc mắc.", example: "The proposal ______ about safety." },
  { test: "Cam 20 Test 1", vocab: "Acknowledge", meaning: "Thừa nhận", type: "v", explanation: "Công nhận điều gì đó là đúng.", example: "Researchers ______ the risks." },
  { test: "Cam 20 Test 1", vocab: "Wary", meaning: "Thận trọng", type: "adj", explanation: "Cẩn thận vì có thể có nguy hiểm.", example: "The public remains ______ about cloning." },
  { test: "Cam 20 Test 1", vocab: "Cloning", meaning: "Nhân bản", type: "n", explanation: "Tạo bản sao di truyền giống hệt.", example: "Scientists debate the ethics of ______." },
  { test: "Cam 20 Test 1", vocab: "Widely held assumption", meaning: "Giả định phổ biến", type: "n", explanation: "Niềm tin được nhiều người chấp nhận.", example: "A ______ is that stress harms decision-making." },
  { test: "Cam 20 Test 1", vocab: "Stress levels", meaning: "Căng thẳng", type: "n", explanation: "Mức độ áp lực tâm lý.", example: "High ______ affect judgement." },
  { test: "Cam 20 Test 1", vocab: "Handle stress", meaning: "Xử lý căng thẳng", type: "v", explanation: "Đối phó với áp lực.", example: "Some professions must ______ daily." },
  { test: "Cam 20 Test 1", vocab: "Methodology", meaning: "Phương pháp luận", type: "n", explanation: "Hệ thống phương pháp nghiên cứu.", example: "The research ______ was carefully designed." },
  { test: "Cam 20 Test 1", vocab: "Mechanism", meaning: "Cơ chế", type: "n", explanation: "Quá trình khiến điều gì xảy ra.", example: "Scientists examined the brain ______." },
  { test: "Cam 20 Test 1", vocab: "Trigger", meaning: "Kích hoạt", type: "v", explanation: "Gây ra phản ứng.", example: "Sudden noise can ______ fear." },
  { test: "Cam 20 Test 1", vocab: "Hyper-vigilant", meaning: "Cảnh giác cao độ", type: "adj", explanation: "Ở trạng thái cảnh giác cực cao.", example: "Stress makes people ______." },
  { test: "Cam 20 Test 1", vocab: "Optimistic", meaning: "Lạc quan", type: "adj", explanation: "Tin rằng điều tốt sẽ xảy ra.", example: "Researchers remain ______ about future findings." },
  { test: "Cam 20 Test 1", vocab: "Alter beliefs", meaning: "Thay đổi niềm tin", type: "v", explanation: "Làm thay đổi quan điểm hoặc niềm tin.", example: "New evidence may ______." },
  { test: "Cam 20 Test 1", vocab: "Weigh up information", meaning: "Cân nhắc thông tin", type: "v", explanation: "Xem xét thông tin trước khi quyết định.", example: "Experts carefully ______ before acting." },
  { test: "Cam 20 Test 1", vocab: "Exaggerate", meaning: "Phóng đại", type: "v", explanation: "Làm điều gì có vẻ lớn hơn thực tế.", example: "Stress may cause people to ______ risks." },
  { test: "Cam 20 Test 1", vocab: "Collective fear", meaning: "Nỗi sợ tập thể", type: "n", explanation: "Nỗi sợ lan rộng trong xã hội.", example: "Media can create ______." },
  { test: "Cam 20 Test 1", vocab: "Contagious", meaning: "Dễ lây lan", type: "adj", explanation: "Có khả năng lan nhanh.", example: "Fear can be surprisingly ______." },
  { test: "Cam 20 Test 1", vocab: "Conscientious", meaning: "Tận tâm", type: "adj", explanation: "Làm việc cẩn thận và có trách nhiệm.", example: "A ______ officer double-checks decisions." },

  // Cam 20 Test 2
  { test: "Cam 20 Test 2", vocab: "By means of", meaning: "Bằng cách", type: "prep", explanation: "Sử dụng một phương pháp hoặc công cụ để đạt được điều gì.", example: "Manatees breathe ______ lungs rather than gills." },
  { test: "Cam 20 Test 2", vocab: "Aquatic vegetation", meaning: "Thực vật thủy sinh", type: "n", explanation: "Thực vật sống trong môi trường nước.", example: "Manatees mainly feed on ______ in rivers." },
  { test: "Cam 20 Test 2", vocab: "Regulate", meaning: "Điều chỉnh", type: "v", explanation: "Kiểm soát hoặc duy trì ở mức ổn định.", example: "Marine mammals must ______ their body temperature." },
  { test: "Cam 20 Test 2", vocab: "Muscles of diaphragm", meaning: "Cơ hoành", type: "n", explanation: "Cơ quan giúp kiểm soát quá trình hô hấp.", example: "The ______ contract during breathing." },
  { test: "Cam 20 Test 2", vocab: "Manatee", meaning: "Lợn biển", type: "n", explanation: "Một loài động vật có vú sống dưới nước lớn, ăn cỏ.", example: "The ______ is often called a sea cow." },
  { test: "Cam 20 Test 2", vocab: "Aquatic habitat", meaning: "Môi trường sống", type: "n", explanation: "Môi trường sống của sinh vật trong nước.", example: "Rivers provide an ideal ______." },
  { test: "Cam 20 Test 2", vocab: "Coastal waters", meaning: "Nước ven biển", type: "n", explanation: "Khu vực biển gần bờ.", example: "Manatees are often found in warm ______." },
  { test: "Cam 20 Test 2", vocab: "Extent", meaning: "Mức độ", type: "n", explanation: "Mức độ hoặc phạm vi của điều gì đó.", example: "Scientists studied the ______ of pollution." },
  { test: "Cam 20 Test 2", vocab: "Entanglement", meaning: "Sự vướng vào", type: "n", explanation: "Bị mắc hoặc vướng vào vật gì đó.", example: "Fishing nets cause dangerous ______." },
  { test: "Cam 20 Test 2", vocab: "Plastic consumption", meaning: "Tiêu thụ nhựa", type: "n", explanation: "Việc động vật ăn phải nhựa.", example: "Marine animals suffer from ______." },
  { test: "Cam 20 Test 2", vocab: "Legislation", meaning: "Pháp luật", type: "n", explanation: "Luật được ban hành bởi chính phủ.", example: "New ______ protects endangered species." },
  { test: "Cam 20 Test 2", vocab: "Boat strikes", meaning: "Va chạm tàu", type: "n", explanation: "Tai nạn khi tàu đâm vào động vật biển.", example: "Many manatees die from ______." },
  { test: "Cam 20 Test 2", vocab: "Aquatic mammals", meaning: "ĐV có vú dưới nước", type: "n", explanation: "Động vật có vú thích nghi với môi trường nước.", example: "Dolphins and whales are ______." },
  { test: "Cam 20 Test 2", vocab: "Flexible flippers", meaning: "Chân chèo", type: "n", explanation: "Chi trước của động vật biển dùng để bơi.", example: "Seals move easily using their ______." },
  { test: "Cam 20 Test 2", vocab: "Tail for propulsion", meaning: "Đuôi để đẩy", type: "n", explanation: "Đuôi được dùng để tạo lực đẩy khi bơi.", example: "The animal uses its ______ to swim." },
  { test: "Cam 20 Test 2", vocab: "Herbivores", meaning: "Động vật ăn cỏ", type: "n", explanation: "Động vật chỉ ăn thực vật.", example: "Manatees are gentle ______." },
  { test: "Cam 20 Test 2", vocab: "Omnivorous", meaning: "Ăn tạp", type: "adj", explanation: "Ăn cả thực vật và động vật.", example: "Bears are ______ animals." },
  { test: "Cam 20 Test 2", vocab: "Molars", meaning: "Răng hàm", type: "n", explanation: "Răng lớn dùng để nghiền thức ăn.", example: "Herbivores use ______ to grind plants." },
  { test: "Cam 20 Test 2", vocab: "Abrasive diet", meaning: "Chế độ ăn mài mòn", type: "n", explanation: "Chế độ ăn khiến răng bị mòn theo thời gian.", example: "Grass creates an ______." },
  { test: "Cam 20 Test 2", vocab: "Buoyancy", meaning: "Sự nổi", type: "n", explanation: "Khả năng nổi trong nước.", example: "Fat helps marine animals maintain ______." },
  { test: "Cam 20 Test 2", vocab: "Subspecies", meaning: "Phân loài", type: "n", explanation: "Nhóm nhỏ hơn trong một loài.", example: "Scientists identified a new ______." },
  { test: "Cam 20 Test 2", vocab: "Ambient water temperature", meaning: "Nhiệt độ nước", type: "n", explanation: "Nhiệt độ tự nhiên của nước xung quanh.", example: "Manatees depend on warm ______." },
  { test: "Cam 20 Test 2", vocab: "Artificially warmed water", meaning: "Nước ấm nhân tạo", type: "n", explanation: "Nước được làm nóng bởi hoạt động con người.", example: "Power plants release ______." },
  { test: "Cam 20 Test 2", vocab: "Put off", meaning: "Trì hoãn", type: "v", explanation: "Hoãn việc gì sang thời điểm sau.", example: "Students often ______ difficult tasks." },
  { test: "Cam 20 Test 2", vocab: "Berate oneself", meaning: "Tự trách", type: "v", explanation: "Chỉ trích bản thân vì lỗi lầm.", example: "People ______ after procrastinating." },
  { test: "Cam 20 Test 2", vocab: "Mood management", meaning: "Quản lý tâm trạng", type: "n", explanation: "Kiểm soát cảm xúc để duy trì trạng thái tích cực.", example: "Procrastination relates to ______." },
  { test: "Cam 20 Test 2", vocab: "Self-worth", meaning: "Giá trị bản thân", type: "n", explanation: "Mức độ một người coi trọng bản thân.", example: "Failure may affect ______." },
  { test: "Cam 20 Test 2", vocab: "Emotion regulation", meaning: "Điều tiết cảm xúc", type: "n", explanation: "Khả năng kiểm soát cảm xúc.", example: "Procrastination weakens ______." },
  { test: "Cam 20 Test 2", vocab: "Self-esteem", meaning: "Lòng tự trọng", type: "n", explanation: "Mức độ tôn trọng bản thân.", example: "Healthy ______ improves motivation." },
  { test: "Cam 20 Test 2", vocab: "Perfectionist", meaning: "Người cầu toàn", type: "n", explanation: "Người luôn muốn mọi thứ hoàn hảo.", example: "A ______ may delay tasks." },
  { test: "Cam 20 Test 2", vocab: "Conditioned", meaning: "Hình thành thói quen", type: "adj", explanation: "Được hình thành qua quá trình học hoặc lặp lại.", example: "Behavior becomes ______ over time." },
  { test: "Cam 20 Test 2", vocab: "Mood boost", meaning: "Cải thiện tâm trạng", type: "n", explanation: "Điều làm tâm trạng tốt hơn.", example: "Watching videos gives a quick ______." },
  { test: "Cam 20 Test 2", vocab: "Fraudulent excuse", meaning: "Lời bào chữa", type: "n", explanation: "Lý do không trung thực để biện minh.", example: "He gave a ______ for missing work." },
  { test: "Cam 20 Test 2", vocab: "Misconduct", meaning: "Hành vi sai", type: "n", explanation: "Hành vi vi phạm quy tắc.", example: "Academic ______ leads to punishment." },
  { test: "Cam 20 Test 2", vocab: "Correlate", meaning: "Có tương quan", type: "v", explanation: "Có mối liên hệ thống kê.", example: "Stress levels ______ procrastination." },
  { test: "Cam 20 Test 2", vocab: "Coping strategies", meaning: "Chiến lược đối phó", type: "n", explanation: "Phương pháp xử lý khó khăn.", example: "Students develop ______ for stress." },
  { test: "Cam 20 Test 2", vocab: "Vicious cycle", meaning: "Vòng luẩn quẩn", type: "n", explanation: "Chuỗi sự kiện tiêu cực lặp lại.", example: "Delay creates a ______." },
  { test: "Cam 20 Test 2", vocab: "Fend off distractions", meaning: "Tránh xao nhãng", type: "v", explanation: "Ngăn chặn các yếu tố gây mất tập trung.", example: "Students must ______." },
  { test: "Cam 20 Test 2", vocab: "Self-compassion", meaning: "Lòng trắc ẩn", type: "n", explanation: "Đối xử tử tế với chính mình khi mắc lỗi.", example: "Practicing ______ reduces guilt." },
  { test: "Cam 20 Test 2", vocab: "Get back on track", meaning: "Đúng hướng", type: "v", explanation: "Tiếp tục thực hiện mục tiêu ban đầu.", example: "Small steps help you ______." },
  { test: "Cam 20 Test 2", vocab: "False assumptions", meaning: "Giả định sai", type: "n", explanation: "Niềm tin không chính xác.", example: "Procrastination often comes from ______." },
  { test: "Cam 20 Test 2", vocab: "Identify", meaning: "Xác định", type: "v", explanation: "Nhận ra hoặc xác định rõ.", example: "Researchers ______ causes of delay." },
  { test: "Cam 20 Test 2", vocab: "Umpire", meaning: "Trọng tài", type: "n", explanation: "Người đưa ra quyết định trong trận đấu.", example: "The ______ called the pitch a strike." },
  { test: "Cam 20 Test 2", vocab: "Automated ball-strike system", meaning: "Hệ thống bóng tự động", type: "n", explanation: "Công nghệ AI xác định pitch trong bóng chày.", example: "MLB tested the ______." },
  { test: "Cam 20 Test 2", vocab: "Strike zone", meaning: "Vùng strike", type: "n", explanation: "Khu vực pitch được tính là strike.", example: "The ball crossed the ______." },
  { test: "Cam 20 Test 2", vocab: "Judgment call", meaning: "Phán đoán", type: "n", explanation: "Quyết định dựa trên đánh giá chủ quan.", example: "The umpire made a ______." },
  { test: "Cam 20 Test 2", vocab: "Controversy", meaning: "Tranh cãi", type: "n", explanation: "Bất đồng ý kiến công khai.", example: "The decision caused ______." },
  { test: "Cam 20 Test 2", vocab: "Algorithm", meaning: "Thuật toán", type: "n", explanation: "Tập hợp quy tắc để xử lý dữ liệu.", example: "The system uses an ______." },
  { test: "Cam 20 Test 2", vocab: "Consensus", meaning: "Sự đồng thuận", type: "n", explanation: "Sự đồng ý chung.", example: "Experts reached a ______." },
  { test: "Cam 20 Test 2", vocab: "Decision-making", meaning: "Sự ra quyết định", type: "n", explanation: "Quá trình chọn lựa phương án.", example: "AI assists human ______." },
  { test: "Cam 20 Test 2", vocab: "Amend", meaning: "Chỉnh sửa", type: "v", explanation: "Thay đổi hoặc cải thiện.", example: "The league may ______ the rules." },
  { test: "Cam 20 Test 2", vocab: "Subjective assessment", meaning: "Đánh giá chủ quan", type: "n", explanation: "Đánh giá dựa trên ý kiến cá nhân.", example: "Human umpires rely on ______." },
  { test: "Cam 20 Test 2", vocab: "Widespread approval", meaning: "Chấp thuận rộng", type: "n", explanation: "Được nhiều người đồng ý.", example: "The new system gained ______." },
  { test: "Cam 20 Test 2", vocab: "Keep up with", meaning: "Bắt kịp", type: "v", explanation: "Theo kịp sự thay đổi.", example: "Sports must ______ technology." },
  { test: "Cam 20 Test 2", vocab: "Changing attitudes", meaning: "Thái độ thay đổi", type: "n", explanation: "Quan điểm của xã hội thay đổi.", example: "The reform reflects ______." },
  { test: "Cam 20 Test 2", vocab: "Retain a young audience", meaning: "Giữ chân khán giả trẻ", type: "v", explanation: "Thu hút người xem trẻ.", example: "Leagues want to ______." },
  { test: "Cam 20 Test 2", vocab: "Enjoyment", meaning: "Sự thích thú", type: "n", explanation: "Cảm giác vui vẻ khi làm điều gì.", example: "Technology may increase fan ______." },
  { test: "Cam 20 Test 2", vocab: "Generalize", meaning: "Nói chung chung", type: "v", explanation: "Rút ra kết luận chung từ một số trường hợp.", example: "Don’t ______ from one bad experience." },
  { test: "Cam 20 Test 2", vocab: "Retaliation", meaning: "Trả thù", type: "n", explanation: "Hành động đáp trả để gây hại lại sau khi bị đối xử tệ.", example: "The company prohibits ______ in the workplace." },
  { test: "Cam 20 Test 2", vocab: "Conventional", meaning: "Thông thường", type: "adj", explanation: "Theo cách truyền thống, phổ biến và được chấp nhận rộng rãi.", example: "They chose a ______ approach instead of taking risks." }
];

const GAME_MODES = ['ENG_VN', 'VN_ENG', 'GAP_FILL', 'MISSING_CHARS'];

// Cấu hình thời gian lặp lại của Spaced Repetition (SRS) 
const SRS_INTERVALS = {
  1: 24 * 60 * 60 * 1000,     // Level 1 -> Level 2: Chờ 24 giờ
  2: 48 * 60 * 60 * 1000,     // Level 2 -> Level 3: Chờ 48 giờ
  3: 7 * 24 * 60 * 60 * 1000, // Level 3 -> Level 4: Chờ 1 tuần (168h)
  4: 14 * 24 * 60 * 60 * 1000,// Level 4 -> Level 5: Chờ 2 tuần (336h)
  5: 28 * 24 * 60 * 60 * 1000 // Level 5: Ôn lại sau 4 tuần 
};

const App = () => {
  // Trạng thái: START, SRS_SELECTION, TEST_SELECTION, SUPER_MEMORY_SELECTION, PLAYING_SRS, PLAYING_FREE, PLAYING_TEST, PLAYING_SUPER_MEMORY, FINISHED_SRS, FINISHED_FREE, FINISHED_TEST, FINISHED_SUPER_MEMORY
  const [gameState, setGameState] = useState('START'); 
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null); 
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [currentTestName, setCurrentTestName] = useState("");
  const [activeSrsLevel, setActiveSrsLevel] = useState(0); 
  
  const inputRef = useRef(null);
  
  // Dữ liệu học tập Spaced Repetition
  const [vocabProgress, setVocabProgress] = useState({});
  const [sessionResults, setSessionResults] = useState([]);
  const [now, setNow] = useState(Date.now());
  
  // Modals state
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDoneConfirm, setShowDoneConfirm] = useState(false); 

  // Thêm tính năng phím tắt (Keyboard shortcuts)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Chặn thao tác phím nếu đang hiện bất kỳ Modal nào
      if (showExitConfirm || showResetConfirm || showDoneConfirm) return;
      if (!['PLAYING_SRS', 'PLAYING_FREE', 'PLAYING_TEST', 'PLAYING_SUPER_MEMORY'].includes(gameState)) return;

      const currentQ = questions[currentStep];

      // Phím Enter
      if (e.key === 'Enter') {
        if (feedback) {
          e.preventDefault();
          nextQuestion(); 
        } else if (hoveredOption && ['ENG_VN', 'VN_ENG', 'GAP_FILL'].includes(currentQ.mode)) {
          e.preventDefault();
          const selectedOpt = currentQ.options.find(o => o.vocab === hoveredOption);
          if (selectedOpt) submitChoice(selectedOpt); 
        }
        return;
      }

      // Phím 1, 2, 3, 4 để chọn đáp án
      if (['1', '2', '3', '4'].includes(e.key) && !feedback && ['ENG_VN', 'VN_ENG', 'GAP_FILL'].includes(currentQ?.mode)) {
        e.preventDefault();
        const optionIndex = parseInt(e.key, 10) - 1;
        if (optionIndex >= 0 && optionIndex < currentQ.options.length) {
          setHoveredOption(currentQ.options[optionIndex].vocab); 
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, questions, currentStep, feedback, hoveredOption, showExitConfirm, showResetConfirm, showDoneConfirm]);

  // Tự động focus vào ô input
  useEffect(() => {
    if (questions[currentStep]?.mode === 'MISSING_CHARS' && !feedback && !showExitConfirm && !showDoneConfirm) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentStep, feedback, questions, showExitConfirm, showDoneConfirm]);

  // Load progress từ Local Storage khi mở app
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('trung_vocab_progress');
      if (savedProgress) {
        setVocabProgress(JSON.parse(savedProgress));
      }
    } catch (e) {}
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Tính thống kê chi tiết cho TỪNG LEVEL của SRS (0 đến 5)
  // Đây là hàm giúp phân loại chính xác số lượng từ vào 6 ô (Chưa học, L1, L2...)
  const srsStatsByLevel = useMemo(() => {
    const stats = {
      0: { total: 0, available: 0, minTime: Infinity },
      1: { total: 0, available: 0, minTime: Infinity },
      2: { total: 0, available: 0, minTime: Infinity },
      3: { total: 0, available: 0, minTime: Infinity },
      4: { total: 0, available: 0, minTime: Infinity },
      5: { total: 0, available: 0, minTime: Infinity },
    };

    RAW_VOCAB.forEach(word => {
      const prog = vocabProgress[word.vocab];
      
      // Logic lọc chặt chẽ: Chỉ khi chưa từng học (undef) HOẶC level=0 thì mới về level 0.
      // Còn lại sẽ map đúng vào level tương ứng (tối đa là 5)
      let safeLvl = 0;
      if (prog && prog.level >= 1) {
        safeLvl = Math.min(prog.level, 5);
      }
      
      stats[safeLvl].total++;

      if (!prog || prog.nextReview <= now) {
        stats[safeLvl].available++;
      } else if (prog.nextReview > now) {
        if (prog.nextReview < stats[safeLvl].minTime) {
          stats[safeLvl].minTime = prog.nextReview;
        }
      }
    });

    return stats;
  }, [vocabProgress, now]);

  // Hàm chuyển đổi thời gian dạng số (ms) sang dạng Text ngắn gọn (ví dụ: 2d 4h)
  const formatCountdownShort = (ms) => {
    if (ms <= 0) return "";
    const totalSeconds = Math.floor(ms / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
  };

  // Hàm chuyển đổi thời gian sang dạng Text đầy đủ (ví dụ: 2 ngày 04:30:00)
  const formatCountdownFull = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (d > 0) {
      return `${d} ngày ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  const timeToNextOverall = useMemo(() => {
    let min = Infinity;
    Object.values(srsStatsByLevel).forEach(stat => { if (stat.minTime < min) min = stat.minTime; });
    return min !== Infinity ? min - now : 0;
  }, [srsStatsByLevel, now]);

  const generateQuestion = (item, forcedMode = null) => {
    const mode = forcedMode === 'SUPER_MEMORY' ? 'MISSING_CHARS' : GAME_MODES[Math.floor(Math.random() * GAME_MODES.length)];
    
    let options = [];
    if (mode === 'ENG_VN' || mode === 'VN_ENG' || mode === 'GAP_FILL') {
      const distractors = RAW_VOCAB
        .filter(v => v.vocab !== item.vocab)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      options = [...distractors, item].sort(() => 0.5 - Math.random());
    }

    let maskedVocab = "";
    if (mode === 'MISSING_CHARS') {
      const chars = item.vocab.split("");
      const percent = forcedMode === 'SUPER_MEMORY' ? 0.7 : 0.6 + Math.random() * 0.1;
      let maskCount = Math.floor(chars.length * percent);
      
      if (maskCount < 1 && chars.length > 1) maskCount = 1;
      if (maskCount >= chars.length && chars.length > 1) maskCount = chars.length - 1;

      const indices = new Set();
      let safetyCounter = 0;
      
      const validIndices = chars.map((c, i) => c !== " " && c !== "-" ? i : -1).filter(i => i !== -1);
      if (maskCount > validIndices.length) maskCount = validIndices.length;

      while(indices.size < maskCount && safetyCounter < 100) {
        indices.add(validIndices[Math.floor(Math.random() * validIndices.length)]);
        safetyCounter++;
      }
      maskedVocab = chars.map((c, i) => indices.has(i) ? "_" : c).join("");
    }

    return { ...item, mode, options, maskedVocab };
  };

  const initSRS = (levelToLearn) => {
    const availableWords = RAW_VOCAB.filter(w => {
      const prog = vocabProgress[w.vocab];
      // Tuân thủ triệt để logic "Từ chưa học" (level 0) và "Đã học" (level >= 1)
      let lvl = 0;
      if (prog && prog.level >= 1) {
        lvl = Math.min(prog.level, 5);
      }

      if (lvl !== levelToLearn) return false;
      return !prog || prog.nextReview <= Date.now();
    });

    if (availableWords.length === 0) return;

    const shuffled = [...availableWords].sort(() => 0.5 - Math.random());
    const gameQuestions = shuffled.map(w => generateQuestion(w));

    setQuestions(gameQuestions);
    setCurrentStep(0);
    setSessionResults([]);
    setActiveSrsLevel(levelToLearn);
    setGameState('PLAYING_SRS');
    setSelectedAnswer(null);
    setHoveredOption(null);
    setInputValue("");
    setFeedback(null);
  };

  const initFreeMode = () => {
    const shuffled = [...RAW_VOCAB].sort(() => 0.5 - Math.random());
    const gameQuestions = shuffled.map(w => generateQuestion(w));

    setQuestions(gameQuestions);
    setCurrentStep(0);
    setSessionResults([]); 
    setGameState('PLAYING_FREE');
    setSelectedAnswer(null);
    setHoveredOption(null);
    setInputValue("");
    setFeedback(null);
  };

  const initTestMode = (testName) => {
    const testWords = RAW_VOCAB.filter(w => w.test === testName);
    const shuffled = [...testWords].sort(() => 0.5 - Math.random());
    const gameQuestions = shuffled.map(w => generateQuestion(w));

    setCurrentTestName(testName);
    setQuestions(gameQuestions);
    setCurrentStep(0);
    setSessionResults([]); 
    setGameState('PLAYING_TEST');
    setSelectedAnswer(null);
    setHoveredOption(null);
    setInputValue("");
    setFeedback(null);
  };

  const initSuperMemoryMode = (testName) => {
    const testWords = RAW_VOCAB.filter(w => w.test === testName);
    const shuffled = [...testWords].sort(() => 0.5 - Math.random());
    const gameQuestions = shuffled.map(w => generateQuestion(w, 'SUPER_MEMORY'));

    setCurrentTestName(testName);
    setQuestions(gameQuestions);
    setCurrentStep(0);
    setSessionResults([]); 
    setGameState('PLAYING_SUPER_MEMORY');
    setSelectedAnswer(null);
    setHoveredOption(null);
    setInputValue("");
    setFeedback(null);
  };

  const submitChoice = (option) => {
    if (feedback) return;
    const currentQ = questions[currentStep];
    const isCorrect = currentQ.vocab === option.vocab;
    
    setSelectedAnswer(option.vocab);
    setFeedback({
      isCorrect,
      correctVocab: currentQ.vocab,
      correctMeaning: currentQ.meaning,
      explanation: currentQ.explanation,
      example: currentQ.example
    });

    setSessionResults(prev => [...prev, { vocab: currentQ.vocab, isCorrect }]);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (feedback) return;
    const currentQ = questions[currentStep];
    const isCorrect = inputValue.toLowerCase().trim() === currentQ.vocab.toLowerCase();

    setFeedback({
      isCorrect,
      correctVocab: currentQ.vocab,
      correctMeaning: currentQ.meaning,
      explanation: currentQ.explanation,
      example: currentQ.example
    });

    setSessionResults(prev => [...prev, { vocab: currentQ.vocab, isCorrect }]);
  };

  const nextQuestion = () => {
    let nextLength = questions.length; // Đồng bộ chiều dài câu hỏi để check EndGame

    // Ép câu hỏi này lặp lại ở cuối danh sách nếu trả lời sai (Áp dụng cho mọi mode)
    if (['PLAYING_FREE', 'PLAYING_TEST', 'PLAYING_SUPER_MEMORY', 'PLAYING_SRS'].includes(gameState) && feedback && !feedback.isCorrect) {
      const wordObj = RAW_VOCAB.find(w => w.vocab === questions[currentStep].vocab);
      const forcedMode = gameState === 'PLAYING_SUPER_MEMORY' ? 'SUPER_MEMORY' : null;
      setQuestions(prev => [...prev, generateQuestion(wordObj, forcedMode)]);
      nextLength++; 
    }

    if (currentStep < nextLength - 1) {
      setCurrentStep(s => s + 1);
      setSelectedAnswer(null);
      setHoveredOption(null);
      setInputValue("");
      setFeedback(null);
    } else {
      if (gameState === 'PLAYING_SRS') {
        processProgress();
        setGameState('FINISHED_SRS');
      }
      else if (gameState === 'PLAYING_FREE') setGameState('FINISHED_FREE');
      else if (gameState === 'PLAYING_TEST') setGameState('FINISHED_TEST');
      else if (gameState === 'PLAYING_SUPER_MEMORY') setGameState('FINISHED_SUPER_MEMORY');
    }
  };

  // Hàm xử lý cốt lõi của SRS (Dùng chung cho lúc hoàn thành HOẶC bấm Done thoát)
  // Sử dụng Functional Update để tránh lỗi Stale State
  const processProgress = () => {
    if (sessionResults.length === 0) return;
    const currentTime = Date.now();

    // Nhóm kết quả: Xác định xem từ đó có làm đúng toàn bộ trong phiên không (hay từng bị sai ít nhất 1 lần)
    const wordStatus = {};
    sessionResults.forEach(res => {
      if (wordStatus[res.vocab] === undefined) {
        wordStatus[res.vocab] = { allCorrect: res.isCorrect };
      } else {
        if (!res.isCorrect) wordStatus[res.vocab].allCorrect = false;
      }
    });

    setVocabProgress(prevProgress => {
      const newProgress = { ...prevProgress };
      
      Object.keys(wordStatus).forEach(vocab => {
        const currentLevel = newProgress[vocab]?.level || 0;
        const passedCleanly = wordStatus[vocab].allCorrect;
        
        let nextLevel;
        let nextReview;
        
        if (passedCleanly) {
          // Làm đúng ngay từ đầu -> Được phép Lên cấp
          nextLevel = Math.min(currentLevel + 1, 5);
          nextReview = currentTime + (SRS_INTERVALS[nextLevel] || Infinity);
        } else {
          // Có ít nhất 1 lần sai -> Bị trừng phạt:
          // Nếu chưa học (0) thì vẫn ở 0 để học tiếp. Nếu đã lên cấp (1-5) thì rớt xuống lại Level 1.
          if (currentLevel === 0) {
            nextLevel = 0;
            nextReview = 0;
          } else {
            nextLevel = 1;
            nextReview = currentTime + SRS_INTERVALS[1];
          }
        }

        newProgress[vocab] = {
          level: nextLevel,
          nextReview: nextReview
        };
      });

      try {
        localStorage.setItem('trung_vocab_progress', JSON.stringify(newProgress));
      } catch (e) {}

      return newProgress;
    });

    setNow(Date.now());
  };

  const saveProgressAndExit = () => {
    processProgress();
    setGameState('SRS_SELECTION');
  };

  const renderGameIcon = (mode) => {
    switch(mode) {
      case 'ENG_VN': return <BookOpen className="w-6 h-6 text-blue-500" />;
      case 'VN_ENG': return <Brain className="w-6 h-6 text-purple-500" />;
      case 'GAP_FILL': return <Pencil className="w-6 h-6 text-orange-500" />;
      case 'MISSING_CHARS': return <RefreshCw className="w-6 h-6 text-green-500" />;
      default: return null;
    }
  };

  // ---------------- UI RENDER ----------------

  if (gameState === 'START') {
    let totalAvailable = 0;
    let totalWaiting = 0;
    
    [0, 1, 2, 3, 4, 5].forEach(lvl => {
      totalAvailable += srsStatsByLevel[lvl].available;
      if (lvl !== 5) totalWaiting += (srsStatsByLevel[lvl].total - srsStatsByLevel[lvl].available);
    });

    return (
      <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border-b-8 border-yellow-200 relative">
          <button onClick={() => setShowResetConfirm(true)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors" title="Xóa dữ liệu">
            <Trash2 className="w-5 h-5" />
          </button>
          
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner relative">
            <Flame className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Trung Vocab</h1>
          <p className="text-gray-500 mb-8 font-medium text-sm">Học thông minh - Ghi nhớ sâu</p>
          
          {/* Block Available & Waiting (Tổng quan) */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center justify-center">
              <div className="text-3xl font-black text-blue-500 mb-1">{totalAvailable}</div>
              <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider text-center">Sẵn sàng ôn</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center justify-center relative">
              <div className="text-3xl font-black text-orange-500 mb-1 flex items-center justify-center gap-1">
                {totalWaiting}
              </div>
              <div className="text-xs text-orange-600 font-semibold uppercase tracking-wider text-center">Đang chờ</div>
              {/* Luôn hiển thị thời gian đếm ngược đến từ tiếp theo nếu có từ đang chờ */}
              {totalWaiting > 0 && (
                <div className="mt-2 w-full text-[11px] font-bold text-orange-600 bg-orange-200/60 px-2 py-1 rounded flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 animate-pulse" /> Tới: {formatCountdownFull(timeToNextOverall)}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={() => setGameState('SRS_SELECTION')}
              className="w-full py-5 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 transform active:scale-95"
            >
              <Brain className="w-6 h-6" />
              SPACED REPETITION (SRS)
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setGameState('TEST_SELECTION')}
                className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 transform active:scale-95"
              >
                <ListChecks className="w-5 h-5" />
                TEST
              </button>

              <button 
                onClick={() => setGameState('SUPER_MEMORY_SELECTION')}
                className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 transform active:scale-95"
              >
                <Zap className="w-5 h-5" />
                SIÊU TRÍ NHỚ
              </button>
            </div>

            <button 
              onClick={initFreeMode}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Repeat className="w-5 h-5" />
              FREE TO ÔN (ALL)
            </button>
          </div>

          {/* Reset Modal */}
          {showResetConfirm && (
            <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 rounded-3xl">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Xóa dữ liệu?</h3>
                <p className="text-gray-600 mb-6 text-sm">Bạn có chắc chắn muốn xóa toàn bộ lịch sử học tập (Levels) không? Hành động này không thể hoàn tác.</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={() => {
                      try {
                        localStorage.removeItem('trung_vocab_progress');
                      } catch(e) {}
                      setVocabProgress({});
                      setNow(Date.now());
                      setShowResetConfirm(false);
                    }}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Màn hình 6 Ô chọn Level (SRS)
  if (gameState === 'SRS_SELECTION') {
    return (
      <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full border-b-8 border-yellow-300 relative">
          <button 
            onClick={() => setGameState('START')} 
            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100"
          >
            <Home className="w-6 h-6" />
          </button>
          
          <div className="text-center mb-6 mt-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Spaced Repetition</h2>
            <p className="text-gray-500 text-sm">Chọn hộp thẻ bài có từ sẵn sàng để ôn tập ngay.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map(lvl => {
              const stat = srsStatsByLevel[lvl];
              const isMastered = lvl === 5;
              const isReady = stat.available > 0;
              const timeToWait = stat.minTime !== Infinity ? stat.minTime - now : 0;

              return (
                <div 
                  key={lvl} 
                  className={`p-5 rounded-2xl border-2 flex flex-col items-center text-center transition-all relative overflow-hidden
                    ${isMastered 
                      ? 'bg-green-50 border-green-200' 
                      : isReady 
                        ? 'bg-white border-blue-300 hover:border-blue-500 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1' 
                        : 'bg-gray-50 border-gray-200 opacity-90'}`}
                  onClick={() => !isMastered && isReady ? initSRS(lvl) : null}
                >
                  <h3 className={`text-sm font-bold mb-2 uppercase tracking-wider 
                    ${isMastered ? 'text-green-600' : isReady ? 'text-blue-500' : 'text-gray-400'}`}>
                    {lvl === 0 ? 'Từ chưa học' : lvl === 5 ? 'Hoàn thành' : `Level ${lvl}`}
                  </h3>
                  
                  {isMastered ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mb-1" />
                      <span className="text-2xl font-black text-green-600">{stat.total}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center mb-1">
                        <span className={`text-3xl font-black ${isReady ? 'text-blue-600' : 'text-gray-400'}`}>
                          {stat.available}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">/ {stat.total} TỪ</span>
                      </div>

                      {!isReady && stat.total > 0 && (
                        <div className="mt-3 text-[11px] font-bold text-orange-600 bg-orange-100 px-2 py-1.5 rounded-lg flex items-center gap-1.5 w-full justify-center">
                          <Clock className="w-3.5 h-3.5" /> 
                          {formatCountdownFull(timeToWait)}
                        </div>
                      )}
                      
                      {!isReady && stat.total === 0 && (
                        <div className="mt-3 text-xs text-gray-400 font-medium">Đang trống</div>
                      )}

                      {isReady && (
                        <div className="mt-3 text-[11px] font-bold text-white bg-blue-500 px-3 py-1.5 rounded-lg flex items-center gap-1 w-full justify-center shadow-sm">
                          HỌC NGAY <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Màn hình chọn Test / Siêu Trí Nhớ
  if (gameState === 'TEST_SELECTION' || gameState === 'SUPER_MEMORY_SELECTION') {
    const isSuperMemory = gameState === 'SUPER_MEMORY_SELECTION';
    // Nhóm các từ vựng theo test và đếm số lượng
    const testGroups = RAW_VOCAB.reduce((acc, word) => {
      if (word.test) {
        acc[word.test] = (acc[word.test] || 0) + 1;
      }
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4">
        <div className={`bg-white rounded-3xl shadow-xl p-8 max-w-md w-full border-b-8 relative ${isSuperMemory ? 'border-pink-200' : 'border-purple-200'}`}>
          <button 
            onClick={() => setGameState('START')} 
            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100"
          >
            <Home className="w-6 h-6" />
          </button>
          
          <div className="text-center mb-6 mt-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isSuperMemory ? 'bg-pink-100' : 'bg-purple-100'}`}>
              {isSuperMemory ? <Zap className="w-8 h-8 text-pink-500" /> : <ListChecks className="w-8 h-8 text-purple-500" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {isSuperMemory ? 'Chọn Test - Siêu Trí Nhớ' : 'Chọn Test để ôn'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isSuperMemory ? 'Thử thách điền từ bị khuyết (ẩn 70%). Từ sai sẽ tự động lặp lại cho đến khi thuộc.' : 'Chế độ này giống Free To Ôn và không ghi đè tiến độ SRS của bạn.'}
            </p>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {Object.keys(testGroups).length === 0 ? (
              <p className="text-center text-gray-400">Chưa có dữ liệu test nào.</p>
            ) : (
              Object.entries(testGroups).map(([testName, count]) => (
                <button
                  key={testName}
                  onClick={() => isSuperMemory ? initSuperMemoryMode(testName) : initTestMode(testName)}
                  className={`w-full py-4 px-6 bg-gray-50 border-2 border-gray-100 text-gray-700 font-bold rounded-2xl transition-all shadow-sm flex items-center justify-between group active:scale-95 ${isSuperMemory ? 'hover:bg-pink-50 hover:border-pink-200' : 'hover:bg-purple-50 hover:border-purple-200'}`}
                >
                  <span className="text-left">{testName}</span>
                  <span className={`text-xs px-2 py-1 rounded-md transition-colors ${isSuperMemory ? 'bg-pink-100 text-pink-600 group-hover:bg-pink-200' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'}`}>{String(count)} từ</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Kết thúc SRS
  if (gameState === 'FINISHED_SRS') {
    const srsWordStatus = {};
    sessionResults.forEach(res => {
      if (srsWordStatus[res.vocab] === undefined) {
        srsWordStatus[res.vocab] = res.isCorrect;
      } else {
        if (!res.isCorrect) srsWordStatus[res.vocab] = false;
      }
    });
    const uniqueWordsCount = Object.keys(srsWordStatus).length;
    const leveledUpCount = Object.values(srsWordStatus).filter(v => v).length;
    const droppedCount = uniqueWordsCount - leveledUpCount;

    return (
      <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border-b-8 border-yellow-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hoàn thành phiên SRS!</h2>
          <div className="text-5xl font-black text-yellow-500 mb-2">100%</div>
          <p className="text-gray-600 mb-6 font-medium">Bạn đã ôn xong {uniqueWordsCount} từ vựng.</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-gray-600 text-left space-y-2">
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> <b>{leveledUpCount}</b> từ vựng được thăng cấp (Level Up).
            </p>
            {droppedCount > 0 && (
              <p className="flex items-center gap-2 text-red-500 font-medium">
                <X className="w-4 h-4" /> <b>{droppedCount}</b> từ sai đã bị rớt (hoặc giữ) Level.
              </p>
            )}
          </div>

          <button 
            onClick={() => setGameState('SRS_SELECTION')}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-2xl transition-all shadow-lg"
          >
            VỀ MÀN HÌNH CHỌN LEVEL
          </button>
        </div>
      </div>
    );
  }

  // Kết thúc Free Mode, Test Mode, Super Memory Mode
  if (['FINISHED_FREE', 'FINISHED_TEST', 'FINISHED_SUPER_MEMORY'].includes(gameState)) {
    const isSuperMemory = gameState === 'FINISHED_SUPER_MEMORY';
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
        <div className={`bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border-b-8 ${isSuperMemory ? 'border-pink-200' : 'border-blue-200'}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isSuperMemory ? 'bg-pink-100' : 'bg-blue-100'}`}>
            {isSuperMemory ? <Zap className="w-10 h-10 text-pink-500" /> : <Flame className="w-10 h-10 text-blue-500" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tuyệt vời!</h2>
          <p className="text-gray-600 mb-6 font-medium leading-relaxed">
            Bạn đã vượt qua chuỗi <strong className={isSuperMemory ? "text-pink-500" : "text-blue-500"}>{questions.length}</strong> thử thách của chế độ 
            {gameState === 'FINISHED_TEST' ? ` Test: ${currentTestName}` : gameState === 'FINISHED_SUPER_MEMORY' ? ` Siêu Trí Nhớ: ${currentTestName}` : ' Free To Ôn'} và đã hoàn thành 100% mục tiêu!
          </p>
          <button 
            onClick={() => setGameState('START')}
            className={`w-full py-4 text-white font-bold rounded-2xl transition-all shadow-lg ${isSuperMemory ? 'bg-pink-500 hover:bg-pink-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            VỀ MÀN HÌNH CHÍNH
          </button>
        </div>
      </div>
    );
  }

  // Giao diện Game (Chung cho cả SRS, Free Mode, Test Mode, Super Memory)
  const currentQ = questions[currentStep];

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex flex-col items-center p-0 md:p-6 font-sans">
      <div className="w-full max-w-2xl bg-white md:rounded-3xl md:shadow-xl overflow-hidden flex flex-col min-h-screen md:min-h-0 relative">
        
        {/* Top Header & Progress Bar */}
        <div className="p-4 bg-white flex items-center gap-3 border-b border-gray-100">
          <button 
            onClick={() => setShowExitConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Về Menu Chính (Bỏ tiến trình)"
          >
            <Home className="w-6 h-6" />
          </button>
          
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-300 ${['PLAYING_FREE', 'PLAYING_TEST', 'PLAYING_SUPER_MEMORY'].includes(gameState) ? (gameState === 'PLAYING_SUPER_MEMORY' ? 'bg-pink-400' : 'bg-blue-400') : 'bg-yellow-400'}`}
              style={{ width: `${((currentStep) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-gray-400 min-w-[3rem] text-right">{currentStep + 1}/{questions.length}</span>

          {gameState === 'PLAYING_SRS' && (
            <button 
              onClick={() => setShowDoneConfirm(true)}
              className="ml-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors"
            >
              Done - Lưu
            </button>
          )}
        </div>

        {/* Chế độ Badge Header Indicator */}
        {gameState === 'PLAYING_SRS' && (
          <div className="w-full bg-yellow-50 text-yellow-700 text-xs font-bold text-center py-1.5 uppercase tracking-widest border-b border-yellow-100 flex items-center justify-center gap-2">
            <Brain className="w-3.5 h-3.5" /> Spaced Repetition {activeSrsLevel === 0 ? '(Từ chưa học)' : `(Level ${activeSrsLevel})`}
          </div>
        )}
        {gameState === 'PLAYING_FREE' && (
          <div className="w-full bg-blue-50 text-blue-600 text-xs font-bold text-center py-1.5 uppercase tracking-widest border-b border-blue-100">
            Free To Ôn Mode (Toàn bộ từ)
          </div>
        )}
        {gameState === 'PLAYING_TEST' && (
          <div className="w-full bg-purple-50 text-purple-600 text-xs font-bold text-center py-1.5 uppercase tracking-widest border-b border-purple-100">
            Đang ôn: {currentTestName}
          </div>
        )}
        {gameState === 'PLAYING_SUPER_MEMORY' && (
          <div className="w-full bg-pink-50 text-pink-600 text-xs font-bold text-center py-1.5 uppercase tracking-widest border-b border-pink-100 flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Siêu Trí Nhớ: {currentTestName}
          </div>
        )}

        {/* Question Area */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
          <div className="mb-4">{renderGameIcon(currentQ.mode)}</div>
          
          <div className="w-full">
            {currentQ.mode === 'ENG_VN' && (
              <>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">{currentQ.vocab}</h2>
                <p className="text-gray-400 font-medium italic mb-8">({currentQ.type}) - Chọn nghĩa tiếng Việt đúng</p>
                <div className="grid grid-cols-1 gap-3 w-full">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        // Double click để nộp luôn, click 1 lần để chọn nháp
                        if (hoveredOption === opt.vocab) submitChoice(opt);
                        else setHoveredOption(opt.vocab);
                      }}
                      className={`py-4 px-6 rounded-2xl border-2 font-semibold text-lg transition-all text-left flex justify-between items-center group
                        ${feedback 
                          ? (selectedAnswer === opt.vocab 
                              ? (feedback.isCorrect ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                              : (opt.vocab === currentQ.vocab ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-400 opacity-50'))
                          : (hoveredOption === opt.vocab 
                              ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100 shadow-md transform scale-[1.02]' 
                              : 'border-gray-200 hover:border-blue-300 text-gray-700')}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`flex items-center justify-center w-7 h-7 rounded text-sm shadow-sm transition-colors
                          ${feedback ? 'bg-white border border-gray-200 text-gray-400' : (hoveredOption === opt.vocab ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border border-gray-200 text-gray-400 group-hover:border-blue-300 group-hover:text-blue-500')}
                        `}>
                          {idx + 1}
                        </span>
                        <span>{opt.meaning}</span>
                      </div>
                      {feedback && opt.vocab === currentQ.vocab && <Check className="w-6 h-6" />}
                      {feedback && selectedAnswer === opt.vocab && !feedback.isCorrect && <X className="w-6 h-6" />}
                    </button>
                  ))}
                </div>
                {!feedback && hoveredOption && (
                  <div className="mt-6 flex justify-center animate-in fade-in duration-200">
                    <button 
                      onClick={() => submitChoice(currentQ.options.find(o => o.vocab === hoveredOption))}
                      className="py-3 px-8 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
                    >
                      CHỐT ĐÁP ÁN 
                      <span className="bg-white/20 px-2 py-1 rounded text-xs uppercase font-bold tracking-wider ml-1">
                        Enter ↵
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}

            {currentQ.mode === 'VN_ENG' && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentQ.meaning}</h2>
                <p className="text-gray-400 font-medium italic mb-8">Chọn từ tiếng Anh đúng</p>
                <div className="grid grid-cols-1 gap-3 w-full">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (hoveredOption === opt.vocab) submitChoice(opt);
                        else setHoveredOption(opt.vocab);
                      }}
                      className={`py-4 px-6 rounded-2xl border-2 font-semibold text-lg transition-all text-left flex justify-between items-center group
                        ${feedback 
                          ? (selectedAnswer === opt.vocab 
                              ? (feedback.isCorrect ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                              : (opt.vocab === currentQ.vocab ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-400 opacity-50'))
                          : (hoveredOption === opt.vocab 
                              ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100 shadow-md transform scale-[1.02]' 
                              : 'border-gray-200 hover:border-blue-300 text-gray-700')}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`flex items-center justify-center w-7 h-7 rounded text-sm shadow-sm transition-colors
                          ${feedback ? 'bg-white border border-gray-200 text-gray-400' : (hoveredOption === opt.vocab ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border border-gray-200 text-gray-400 group-hover:border-blue-300 group-hover:text-blue-500')}
                        `}>
                          {idx + 1}
                        </span>
                        <span>{opt.vocab}</span>
                      </div>
                      {feedback && opt.vocab === currentQ.vocab && <Check className="w-6 h-6" />}
                      {feedback && selectedAnswer === opt.vocab && !feedback.isCorrect && <X className="w-6 h-6" />}
                    </button>
                  ))}
                </div>
                {!feedback && hoveredOption && (
                  <div className="mt-6 flex justify-center animate-in fade-in duration-200">
                    <button 
                      onClick={() => submitChoice(currentQ.options.find(o => o.vocab === hoveredOption))}
                      className="py-3 px-8 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
                    >
                      CHỐT ĐÁP ÁN 
                      <span className="bg-white/20 px-2 py-1 rounded text-xs uppercase font-bold tracking-wider ml-1">
                        Enter ↵
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}

            {currentQ.mode === 'GAP_FILL' && (
              <>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 mb-6 w-full max-w-xl mx-auto shadow-inner">
                  <p className="text-xl text-gray-700 leading-relaxed font-semibold">
                    {currentQ.example.replace(new RegExp(currentQ.vocab, 'gi'), "______")}
                  </p>
                </div>
                <p className="text-gray-400 font-medium italic mb-6">Chọn từ thích hợp điền vào chỗ trống</p>
                <div className="grid grid-cols-1 gap-3 w-full">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (hoveredOption === opt.vocab) submitChoice(opt);
                        else setHoveredOption(opt.vocab);
                      }}
                      className={`py-4 px-6 rounded-2xl border-2 font-semibold text-lg transition-all text-left flex justify-between items-center group
                        ${feedback 
                          ? (selectedAnswer === opt.vocab 
                              ? (feedback.isCorrect ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                              : (opt.vocab === currentQ.vocab ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-400 opacity-50'))
                          : (hoveredOption === opt.vocab 
                              ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100 shadow-md transform scale-[1.02]' 
                              : 'border-gray-200 hover:border-blue-300 text-gray-700')}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`flex items-center justify-center w-7 h-7 rounded text-sm shadow-sm transition-colors
                          ${feedback ? 'bg-white border border-gray-200 text-gray-400' : (hoveredOption === opt.vocab ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border border-gray-200 text-gray-400 group-hover:border-blue-300 group-hover:text-blue-500')}
                        `}>
                          {idx + 1}
                        </span>
                        <span>{opt.vocab}</span>
                      </div>
                      {feedback && opt.vocab === currentQ.vocab && <Check className="w-6 h-6" />}
                      {feedback && selectedAnswer === opt.vocab && !feedback.isCorrect && <X className="w-6 h-6" />}
                    </button>
                  ))}
                </div>
                {!feedback && hoveredOption && (
                  <div className="mt-6 flex justify-center animate-in fade-in duration-200">
                    <button 
                      onClick={() => submitChoice(currentQ.options.find(o => o.vocab === hoveredOption))}
                      className="py-3 px-8 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
                    >
                      CHỐT ĐÁP ÁN 
                      <span className="bg-white/20 px-2 py-1 rounded text-xs uppercase font-bold tracking-wider ml-1">
                        Enter ↵
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}

            {currentQ.mode === 'MISSING_CHARS' && (
              <div className="w-full max-w-md mx-auto">
                <div className={`bg-gray-50 p-6 rounded-3xl border border-gray-200 mb-8 shadow-inner ${gameState === 'PLAYING_SUPER_MEMORY' ? 'bg-pink-50 border-pink-200' : ''}`}>
                  <h2 className="text-4xl font-bold text-gray-800 tracking-widest">{currentQ.maskedVocab}</h2>
                  <p className="mt-4 text-gray-500">{currentQ.meaning}</p>
                </div>

                <form onSubmit={handleInputSubmit} className="relative">
                  <input
                    ref={inputRef}
                    autoFocus
                    type="text"
                    value={inputValue}
                    disabled={!!feedback}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Gõ từ của bạn..."
                    className={`w-full py-4 px-6 rounded-2xl border-2 text-center text-xl font-bold outline-none transition-all
                      ${feedback 
                        ? (feedback.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                        : `border-gray-200 focus:shadow-sm ${gameState === 'PLAYING_SUPER_MEMORY' ? 'focus:border-pink-400' : 'focus:border-blue-400'}`}
                    `}
                  />
                  {!feedback && (
                    <button type="submit" className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${gameState === 'PLAYING_SUPER_MEMORY' ? 'text-pink-400 hover:text-pink-600' : 'text-gray-400 hover:text-blue-500'}`}>
                      <ArrowRight className="w-8 h-8" />
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Section */}
        {feedback && (
          <div className={`p-6 animate-in slide-in-from-bottom-full duration-300 ${feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
            <div className="flex items-start gap-4 text-white mb-4">
              <div className="bg-white/20 p-2 rounded-xl">
                {feedback.isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">
                  {feedback.isCorrect 
                    ? (gameState === 'PLAYING_SRS' ? 'Chính xác! Lên cấp!' : 'Chính xác!') 
                    : (['PLAYING_FREE', 'PLAYING_TEST', 'PLAYING_SUPER_MEMORY'].includes(gameState) ? 'Chưa đúng rồi! Câu này sẽ lặp lại sau.' : 'Chưa đúng rồi, sẽ phải làm lại vào cuối phiên!')}
                </h4>
                {!feedback.isCorrect && (
                  <div className="font-medium opacity-95 bg-black/10 p-2 rounded mt-2">
                    <p>Đáp án: <span className="font-bold text-xl">{feedback.correctVocab}</span></p>
                    <p className="text-sm">Nghĩa là: {feedback.correctMeaning}</p>
                  </div>
                )}
                <p className="text-sm mt-3 opacity-90 leading-snug bg-white/10 p-2 rounded">
                  <span className="font-bold mr-1">Giải thích: </span>
                  {feedback.explanation}
                </p>
                {feedback.example && (
                  <p className="text-sm mt-2 opacity-90 leading-snug bg-white/10 p-2 rounded">
                    <span className="font-bold mr-1">Ví dụ: </span>
                    <span className="italic">{feedback.example.replace(/_+/g, feedback.correctVocab)}</span>
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={nextQuestion}
              className="w-full py-3 bg-white text-gray-800 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              TIẾP TỤC 
              <span className="bg-gray-200 text-gray-500 text-[10px] uppercase font-bold px-2 py-1 rounded shadow-inner ml-1 tracking-wider">
                Enter ↵
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Exit Modal (Home Button) */}
        {showExitConfirm && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Thoát phiên học?</h3>
              <p className="text-gray-600 mb-6 text-sm">Thoát ra ngay bây giờ sẽ KHÔNG lưu tiến trình của phiên học này. Bạn có chắc chắn muốn thoát?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    setShowExitConfirm(false);
                    setGameState(gameState === 'PLAYING_SRS' ? 'SRS_SELECTION' : 'START');
                  }}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
                >
                  Thoát
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Done Modal (SRS Specific) */}
        {showDoneConfirm && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Lưu và Thoát?</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Hệ thống sẽ lưu lại tiến trình của các từ bạn <b>ĐÃ LÀM</b> trong phiên này. Các từ chưa làm sẽ được giữ nguyên trạng thái cũ.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDoneConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    setShowDoneConfirm(false);
                    saveProgressAndExit();
                  }}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all"
                >
                  Lưu & Thoát
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;