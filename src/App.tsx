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

  // Cam 17 Test 2
  { test: "Cam 17 Test 2", vocab: "Shattering", meaning: "Vỡ nát", type: "adj", explanation: "Bị vỡ thành nhiều mảnh nhỏ hoặc gây sốc mạnh.", example: "The glass made a ______ sound when it broke." },
  { test: "Cam 17 Test 2", vocab: "Toss", meaning: "Quăng", type: "v", explanation: "Ném nhẹ hoặc nhanh một vật.", example: "He ______ the stone into the river." },
  { test: "Cam 17 Test 2", vocab: "Stumble upon", meaning: "Tình cờ gặp", type: "v", explanation: "Phát hiện điều gì đó một cách bất ngờ.", example: "Researchers ______ an ancient manuscript." },
  { test: "Cam 17 Test 2", vocab: "Hebrew", meaning: "Tiếng Do Thái", type: "n", explanation: "Ngôn ngữ cổ và hiện đại của người Do Thái.", example: "The text was written in ______." },
  { test: "Cam 17 Test 2", vocab: "Fragments", meaning: "Mảnh vỡ", type: "n", explanation: "Những phần nhỏ bị tách ra từ vật lớn.", example: "Archaeologists found ______ of pottery." },
  { test: "Cam 17 Test 2", vocab: "Antiquities", meaning: "Cổ vật", type: "n", explanation: "Các vật có giá trị lịch sử cổ xưa.", example: "The museum displays rare ______." },
  { test: "Cam 17 Test 2", vocab: "Bible", meaning: "Kinh thánh", type: "n", explanation: "Cuốn sách tôn giáo quan trọng của Kitô giáo.", example: "The passage comes from the ______." },
  { test: "Cam 17 Test 2", vocab: "Acquire", meaning: "Mua / có được", type: "v", explanation: "Nhận được hoặc mua một thứ gì đó.", example: "The collector ______ rare documents." },
  { test: "Cam 17 Test 2", vocab: "Decipher", meaning: "Giải mã", type: "v", explanation: "Hiểu hoặc giải mã văn bản khó đọc.", example: "Scholars tried to ______ the ancient script." },
  { test: "Cam 17 Test 2", vocab: "Settlement", meaning: "Khu định cư", type: "n", explanation: "Nơi con người sinh sống.", example: "The ruins revealed an early ______." },
  { test: "Cam 17 Test 2", vocab: "Chisel", meaning: "Đục, chạm khắc", type: "v", explanation: "Cắt hoặc khắc vật liệu cứng.", example: "Workers ______ inscriptions into stone." },
  { test: "Cam 17 Test 2", vocab: "Withstand", meaning: "Chịu được", type: "v", explanation: "Chịu đựng áp lực hoặc điều kiện khắc nghiệt.", example: "The structure can ______ strong winds." },
  { test: "Cam 17 Test 2", vocab: "Miscellaneous", meaning: "Khác nhau / linh tinh", type: "adj", explanation: "Bao gồm nhiều loại khác nhau.", example: "The box contained ______ items." },
  { test: "Cam 17 Test 2", vocab: "Reassemble", meaning: "Lắp ráp lại", type: "v", explanation: "Ghép các phần lại thành một tổng thể.", example: "Experts tried to ______ the broken artifact." },
  { test: "Cam 17 Test 2", vocab: "Resist", meaning: "Kháng cự", type: "v", explanation: "Chống lại tác động hoặc lực.", example: "Some bacteria ______ antibiotics." },
  { test: "Cam 17 Test 2", vocab: "Infection", meaning: "Sự nhiễm trùng", type: "n", explanation: "Tình trạng vi khuẩn hoặc virus xâm nhập cơ thể.", example: "The wound developed an ______." },
  { test: "Cam 17 Test 2", vocab: "Strain", meaning: "Chủng", type: "n", explanation: "Một biến thể của vi khuẩn hoặc virus.", example: "A new ______ of virus was identified." },
  { test: "Cam 17 Test 2", vocab: "Devastate", meaning: "Tàn phá", type: "v", explanation: "Phá hủy nghiêm trọng.", example: "The disease ______ entire populations." },
  { test: "Cam 17 Test 2", vocab: "Domesticate", meaning: "Thuần hóa", type: "v", explanation: "Biến động vật hoang dã thành vật nuôi.", example: "Humans began to ______ animals thousands of years ago." },
  { test: "Cam 17 Test 2", vocab: "Obscure", meaning: "Ít người biết", type: "adj", explanation: "Không nổi tiếng hoặc khó hiểu.", example: "The theory remains ______." },
  { test: "Cam 17 Test 2", vocab: "Mainstream", meaning: "Xu hướng chính", type: "n", explanation: "Xu hướng phổ biến trong xã hội.", example: "The idea became part of the ______." },
  { test: "Cam 17 Test 2", vocab: "Tasty", meaning: "Ngon", type: "adj", explanation: "Có vị ngon.", example: "The dish was simple but ______." },
  { test: "Cam 17 Test 2", vocab: "Aromatic", meaning: "Thơm", type: "adj", explanation: "Có mùi dễ chịu.", example: "The herbs gave the food an ______ smell." },
  { test: "Cam 17 Test 2", vocab: "Tolerant", meaning: "Chịu được", type: "adj", explanation: "Có khả năng chịu đựng điều kiện.", example: "This plant is ______ to heat." },
  { test: "Cam 17 Test 2", vocab: "Thrive", meaning: "Phát triển mạnh", type: "v", explanation: "Phát triển khỏe mạnh.", example: "Plants ______ in warm climates." },
  { test: "Cam 17 Test 2", vocab: "Staple", meaning: "Thực phẩm chính", type: "n", explanation: "Loại thực phẩm cơ bản.", example: "Rice is a ______ food in many countries." },
  { test: "Cam 17 Test 2", vocab: "Advisable", meaning: "Nên làm", type: "adj", explanation: "Được khuyến nghị.", example: "It is ______ to check the data carefully." },
  { test: "Cam 17 Test 2", vocab: "Desire", meaning: "Mong muốn", type: "n", explanation: "Ước muốn mạnh mẽ.", example: "He had a strong ______ to succeed." },
  { test: "Cam 17 Test 2", vocab: "Conventional", meaning: "Thông thường", type: "adj", explanation: "Theo cách truyền thống.", example: "This is a ______ method." },
  { test: "Cam 17 Test 2", vocab: "Criticise", meaning: "Chỉ trích", type: "v", explanation: "Nêu ra lỗi hoặc khuyết điểm.", example: "The report was widely ______." },
  { test: "Cam 17 Test 2", vocab: "Misrepresent", meaning: "Xuyên tạc", type: "v", explanation: "Trình bày sai sự thật.", example: "The media may ______ facts." },
  { test: "Cam 17 Test 2", vocab: "Undermine", meaning: "Làm suy yếu", type: "v", explanation: "Làm giảm hiệu quả hoặc sức mạnh.", example: "False claims can ______ trust." },
  { test: "Cam 17 Test 2", vocab: "Lay the foundation", meaning: "Đặt nền móng", type: "v", explanation: "Tạo cơ sở ban đầu cho điều gì.", example: "This research ______ for future studies." },
  { test: "Cam 17 Test 2", vocab: "Jump off", meaning: "Bắt đầu", type: "v", explanation: "Khởi đầu một hoạt động.", example: "The project will ______ next week." },
  { test: "Cam 17 Test 2", vocab: "Breakthrough", meaning: "Đột phá", type: "n", explanation: "Phát hiện quan trọng.", example: "Scientists made a major ______." },
  { test: "Cam 17 Test 2", vocab: "Noteworthy", meaning: "Đáng chú ý", type: "adj", explanation: "Đáng được quan tâm.", example: "The results are ______." },
  { test: "Cam 17 Test 2", vocab: "Coincide", meaning: "Trùng hợp", type: "v", explanation: "Xảy ra cùng lúc.", example: "The findings ______ with earlier studies." },
  { test: "Cam 17 Test 2", vocab: "Vague", meaning: "Mơ hồ", type: "adj", explanation: "Không rõ ràng.", example: "His explanation was too ______." },
  { test: "Cam 17 Test 2", vocab: "Merely", meaning: "Chỉ đơn thuần", type: "adv", explanation: "Chỉ là, không hơn.", example: "It was ______ a suggestion." },
  { test: "Cam 17 Test 2", vocab: "Groundbreaking", meaning: "Đột phá", type: "adj", explanation: "Mang tính cách mạng.", example: "The study is ______." },
  { test: "Cam 17 Test 2", vocab: "Provenance", meaning: "Nguồn gốc", type: "n", explanation: "Xuất xứ của vật.", example: "The artifact's ______ was unclear." },
  { test: "Cam 17 Test 2", vocab: "Spontaneously", meaning: "Tự nhiên", type: "adv", explanation: "Không có kế hoạch trước.", example: "The reaction occurred ______." },
  { test: "Cam 17 Test 2", vocab: "Postulate", meaning: "Giả thuyết", type: "v", explanation: "Đưa ra giả định.", example: "Scientists ______ a new theory." },
  { test: "Cam 17 Test 2", vocab: "Serendipity", meaning: "Sự tình cờ may mắn", type: "n", explanation: "Phát hiện bất ngờ nhưng có giá trị.", example: "The discovery was pure ______." },
  
  // Cam 17 Test 3
  { test: "Cam 17 Test 3", vocab: "Resemblance", meaning: "Sự giống nhau", type: "n", explanation: "Sự tương đồng về hình dạng, đặc điểm hoặc bản chất giữa hai sự vật.", example: "Scientists noticed a strong ______ between the two species." },

  { test: "Cam 17 Test 3", vocab: "Exclusively", meaning: "Duy nhất / chỉ riêng", type: "adv", explanation: "Chỉ bao gồm hoặc chỉ dành cho một đối tượng.", example: "This animal lives ______ in Tasmania." },

  { test: "Cam 17 Test 3", vocab: "Carnivorous", meaning: "Ăn thịt", type: "adj", explanation: "Động vật ăn thịt các loài khác để sinh tồn.", example: "The tiger is a ______ mammal." },

  { test: "Cam 17 Test 3", vocab: "Emerge", meaning: "Hiện ra / xuất hiện", type: "v", explanation: "Xuất hiện sau khi bị che khuất hoặc chưa được biết đến.", example: "New evidence began to ______ from the excavation." },

  { test: "Cam 17 Test 3", vocab: "Pouch", meaning: "Cái túi", type: "n", explanation: "Túi tự nhiên trên cơ thể một số loài động vật, đặc biệt là thú có túi.", example: "The baby kangaroo stayed safely inside its mother's ______." },

  { test: "Cam 17 Test 3", vocab: "Lair", meaning: "Hang ổ", type: "n", explanation: "Nơi trú ẩn của động vật hoang dã.", example: "The predator returned to its ______ before sunrise." },

  { test: "Cam 17 Test 3", vocab: "Mainland", meaning: "Đất liền", type: "n", explanation: "Phần đất chính của một quốc gia, không phải đảo.", example: "The species disappeared from the ______ centuries ago." },

  { test: "Cam 17 Test 3", vocab: "Well-dated", meaning: "Có niên đại rõ", type: "adj", explanation: "Được xác định niên đại rõ ràng.", example: "Archaeologists found several ______ fossils." },

  { test: "Cam 17 Test 3", vocab: "Carbon-dated", meaning: "Được xác định niên đại bằng carbon", type: "adj", explanation: "Được xác định tuổi bằng phương pháp carbon phóng xạ.", example: "The bones were carefully ______." },

  { test: "Cam 17 Test 3", vocab: "Settlers", meaning: "Người định cư", type: "n", explanation: "Người chuyển đến sinh sống lâu dài ở vùng đất mới.", example: "Early ______ introduced farming techniques." },

  { test: "Cam 17 Test 3", vocab: "Distemper", meaning: "Bệnh sài sốt", type: "n", explanation: "Bệnh truyền nhiễm nghiêm trọng ở động vật.", example: "The disease resembled canine ______." },

  { test: "Cam 17 Test 3", vocab: "Attribute A to B", meaning: "Cho rằng A xảy ra vì B", type: "v", explanation: "Quy nguyên nhân của một sự việc cho yếu tố khác.", example: "Researchers ______ the extinction ______ disease." },

  { test: "Cam 17 Test 3", vocab: "Captivity", meaning: "Nuôi nhốt", type: "n", explanation: "Tình trạng bị giữ trong môi trường kiểm soát.", example: "Some rare animals breed successfully in ______." },

  { test: "Cam 17 Test 3", vocab: "Foresee", meaning: "Thấy trước", type: "v", explanation: "Dự đoán điều có thể xảy ra trong tương lai.", example: "Nobody could ______ the environmental crisis." },

  { test: "Cam 17 Test 3", vocab: "Demise", meaning: "Sự sụp đổ / diệt vong", type: "n", explanation: "Sự kết thúc hoàn toàn của hệ thống, loài hoặc tổ chức.", example: "The species faced rapid ______." },

  { test: "Cam 17 Test 3", vocab: "Diminish", meaning: "Giảm bớt", type: "v", explanation: "Trở nên ít hơn về số lượng hoặc mức độ.", example: "Natural resources continue to ______." },

  { test: "Cam 17 Test 3", vocab: "Extermination", meaning: "Sự tiêu diệt", type: "n", explanation: "Hành động loại bỏ hoàn toàn.", example: "Human hunting caused the ______ of many species." },

  { test: "Cam 17 Test 3", vocab: "Scarcity", meaning: "Sự khan hiếm", type: "n", explanation: "Tình trạng thiếu hụt nguồn lực.", example: "Water ______ affected agriculture." },

  { test: "Cam 17 Test 3", vocab: "Rehome", meaning: "Tái định cư", type: "v", explanation: "Chuyển người hoặc động vật đến nơi sống mới.", example: "Volunteers worked to ______ rescued animals." },

  { test: "Cam 17 Test 3", vocab: "Impractical", meaning: "Không thực tế", type: "adj", explanation: "Khó áp dụng trong thực tế.", example: "The proposal sounded innovative but ______." },

  { test: "Cam 17 Test 3", vocab: "Declare", meaning: "Tuyên bố", type: "v", explanation: "Công khai thông báo điều gì đó.", example: "The government officially ______ the area protected." },

  { test: "Cam 17 Test 3", vocab: "Cultivation", meaning: "Sự canh tác", type: "n", explanation: "Quá trình trồng trọt đất đai.", example: "Rice ______ transformed the region." },

  { test: "Cam 17 Test 3", vocab: "Plantation", meaning: "Đồn điền", type: "n", explanation: "Khu đất lớn dùng để trồng cây thương mại.", example: "The rubber ______ covered thousands of hectares." },

  { test: "Cam 17 Test 3", vocab: "Hectare", meaning: "Héc-ta", type: "n", explanation: "Đơn vị đo diện tích đất bằng 10.000 mét vuông.", example: "Farmers cultivated over 500 ______ of land." },

  { test: "Cam 17 Test 3", vocab: "Rapeseed", meaning: "Hạt cải dầu", type: "n", explanation: "Loại cây trồng dùng để sản xuất dầu ăn.", example: "Fields of ______ bloom brightly in spring." },

  { test: "Cam 17 Test 3", vocab: "Immensely", meaning: "Vô cùng", type: "adv", explanation: "Ở mức độ rất lớn.", example: "The discovery was ______ valuable." },

  { test: "Cam 17 Test 3", vocab: "Patch", meaning: "Mảnh đất / vùng", type: "n", explanation: "Một khu vực nhỏ có đặc điểm riêng.", example: "A small ______ of forest survived." },

  { test: "Cam 17 Test 3", vocab: "Virgin", meaning: "Nguyên sinh", type: "adj", explanation: "Chưa bị con người khai phá.", example: "They explored ______ rainforest." },

  { test: "Cam 17 Test 3", vocab: "Derive from", meaning: "Bắt nguồn từ", type: "v", explanation: "Có nguồn gốc từ điều gì đó.", example: "Many medicines ______ plants." },

  { test: "Cam 17 Test 3", vocab: "Property", meaning: "Đặc tính", type: "n", explanation: "Đặc điểm vốn có của vật chất hoặc sự vật.", example: "Water has unique chemical ______." },

  { test: "Cam 17 Test 3", vocab: "Sterile", meaning: "Vô trùng", type: "adj", explanation: "Không có vi khuẩn hoặc vi sinh vật.", example: "Medical tools must remain ______." },

  { test: "Cam 17 Test 3", vocab: "Monoculture", meaning: "Độc canh", type: "n", explanation: "Chỉ trồng một loại cây trên diện rộng.", example: "Large-scale ______ may reduce biodiversity." },

  { test: "Cam 17 Test 3", vocab: "Epiphytic", meaning: "Biểu sinh", type: "adj", explanation: "Thực vật sống bám trên cây khác.", example: "Orchids are often ______ plants." },

  { test: "Cam 17 Test 3", vocab: "Keystone", meaning: "Nhân tố chủ chốt", type: "n", explanation: "Yếu tố cực kỳ quan trọng trong hệ thống.", example: "Bees are a ______ species in many ecosystems." },

  { test: "Cam 17 Test 3", vocab: "Fungi", meaning: "Nấm", type: "n", explanation: "Nhóm sinh vật như nấm men, nấm mốc.", example: "Forest soil contains millions of ______." },

  { test: "Cam 17 Test 3", vocab: "Invertebrates", meaning: "Động vật không xương sống", type: "n", explanation: "Động vật không có cột sống.", example: "Insects are common ______." },

  { test: "Cam 17 Test 3", vocab: "Amphibian", meaning: "Động vật lưỡng cư", type: "n", explanation: "Động vật sống được cả dưới nước và trên cạn.", example: "Frogs are typical ______." },

  { test: "Cam 17 Test 3", vocab: "Reptile", meaning: "Bò sát", type: "n", explanation: "Động vật máu lạnh như rắn, thằn lằn.", example: "The crocodile is a large ______." },

  { test: "Cam 17 Test 3", vocab: "Mammal", meaning: "Động vật có vú", type: "n", explanation: "Động vật nuôi con bằng sữa mẹ.", example: "Whales are marine ______." },

  { test: "Cam 17 Test 3", vocab: "Seize", meaning: "Nắm bắt", type: "v", explanation: "Nhanh chóng tận dụng cơ hội.", example: "Businesses must ______ market opportunities." },

  { test: "Cam 17 Test 3", vocab: "Maximise", meaning: "Tối đa hóa", type: "v", explanation: "Làm tăng đến mức cao nhất.", example: "Farmers try to ______ crop yields." },

  { test: "Cam 17 Test 3", vocab: "Cropland", meaning: "Đất canh tác", type: "n", explanation: "Đất được sử dụng cho nông nghiệp.", example: "The region has fertile ______." },

  { test: "Cam 17 Test 3", vocab: "Justification", meaning: "Sự biện minh", type: "n", explanation: "Lý do hợp lý để giải thích hành động.", example: "There was little ______ for the decision." },

  { test: "Cam 17 Test 3", vocab: "Boycott", meaning: "Sự tẩy chay", type: "n", explanation: "Việc từ chối ủng hộ để phản đối.", example: "Consumers launched a ______ campaign." },

  { test: "Cam 17 Test 3", vocab: "Lift", meaning: "Bãi bỏ", type: "v", explanation: "Xóa bỏ lệnh cấm hoặc hạn chế.", example: "The government decided to ______ the restrictions." },

  { test: "Cam 17 Test 3", vocab: "Utilitarian", meaning: "Thực dụng", type: "adj", explanation: "Tập trung vào lợi ích thực tế.", example: "The design is simple and ______." },

  { test: "Cam 17 Test 3", vocab: "Bone of contention", meaning: "Chủ đề gây tranh cãi", type: "n", explanation: "Vấn đề khiến nhiều bên bất đồng.", example: "Land ownership became a ______." },

  { test: "Cam 17 Test 3", vocab: "Dwindle", meaning: "Suy giảm", type: "v", explanation: "Giảm dần theo thời gian.", example: "Fish populations continue to ______." },

  { test: "Cam 17 Test 3", vocab: "Refrigerated", meaning: "Được làm lạnh", type: "adj", explanation: "Được bảo quản ở nhiệt độ thấp.", example: "Food must be kept ______." },

  { test: "Cam 17 Test 3", vocab: "Incorporate", meaning: "Kết hợp", type: "v", explanation: "Đưa một phần vào tổng thể.", example: "The architect ______ natural materials into the design." },

  { test: "Cam 17 Test 3", vocab: "Geology", meaning: "Địa chất học", type: "n", explanation: "Ngành nghiên cứu cấu trúc Trái Đất.", example: "She studied ______ at university." },

  { test: "Cam 17 Test 3", vocab: "Cluster", meaning: "Tụ lại thành cụm", type: "v", explanation: "Tập trung thành nhóm nhỏ.", example: "Buildings ______ around the city center." },

  { test: "Cam 17 Test 3", vocab: "Address", meaning: "Giải quyết / đề cập", type: "v", explanation: "Xử lý hoặc nói đến một vấn đề.", example: "The meeting aimed to ______ housing shortages." },

  { test: "Cam 17 Test 3", vocab: "Compilation", meaning: "Sự biên soạn", type: "n", explanation: "Tập hợp thông tin từ nhiều nguồn.", example: "The book is a ______ of historical records." },

  { test: "Cam 17 Test 3", vocab: "Set the stage for", meaning: "Tạo tiền đề cho", type: "v", explanation: "Chuẩn bị điều kiện cho điều gì xảy ra.", example: "The reforms ______ economic growth." },

  { test: "Cam 17 Test 3", vocab: "Tenement", meaning: "Khu nhà ổ chuột", type: "n", explanation: "Nhà tập thể cũ, chật chội.", example: "Many workers lived in crowded ______." },

  { test: "Cam 17 Test 3", vocab: "Skyscraper", meaning: "Tòa nhà chọc trời", type: "n", explanation: "Tòa nhà rất cao trong đô thị.", example: "Modern ______ dominate the skyline." },

  { test: "Cam 17 Test 3", vocab: "Slum", meaning: "Khu ổ chuột", type: "n", explanation: "Khu dân cư nghèo, điều kiện sống kém.", example: "The government planned to clear the ______." },

  { test: "Cam 17 Test 3", vocab: "Clearance", meaning: "Sự giải tỏa", type: "n", explanation: "Việc dọn dẹp hoặc phá bỏ khu vực.", example: "Urban ______ displaced thousands of residents." },

  { test: "Cam 17 Test 3", vocab: "Fraction", meaning: "Một phần nhỏ", type: "n", explanation: "Một phần rất nhỏ của tổng thể.", example: "Only a ______ of the city remains unchanged." },

  { test: "Cam 17 Test 3", vocab: "Glance", meaning: "Cái nhìn lướt", type: "n", explanation: "Cái nhìn nhanh trong thời gian ngắn.", example: "At first ______, the building looked ordinary." },

  { test: "Cam 17 Test 3", vocab: "Specialised", meaning: "Chuyên biệt", type: "adj", explanation: "Được thiết kế cho mục đích cụ thể.", example: "The lab uses ______ equipment." },

  { test: "Cam 17 Test 3", vocab: "Draw on", meaning: "Dựa vào", type: "v", explanation: "Sử dụng kiến thức hoặc nguồn lực sẵn có.", example: "The documentary ______ historical archives." },

  { test: "Cam 17 Test 3", vocab: "Footage", meaning: "Đoạn phim", type: "n", explanation: "Video được ghi hình.", example: "Researchers reviewed old ______." },

  { test: "Cam 17 Test 3", vocab: "Lengthy", meaning: "Dài dòng", type: "adj", explanation: "Kéo dài hơn bình thường.", example: "The report was too ______ to finish in one day." },

  { test: "Cam 17 Test 3", vocab: "Exuberance", meaning: "Sự nhiệt huyết", type: "n", explanation: "Nguồn năng lượng tích cực, mạnh mẽ.", example: "Children showed great ______ during the event." },

  { test: "Cam 17 Test 3", vocab: "Viability", meaning: "Khả năng tồn tại", type: "n", explanation: "Khả năng thành công hoặc duy trì lâu dài.", example: "Experts questioned the ______ of the project." },

  { test: "Cam 17 Test 3", vocab: "Epilogue", meaning: "Phần kết", type: "n", explanation: "Phần cuối bổ sung cho tác phẩm hoặc câu chuyện.", example: "The novel ends with an emotional ______." },

  { test: "Cam 17 Test 3", vocab: "Subterranean", meaning: "Dưới lòng đất", type: "adj", explanation: "Nằm dưới bề mặt đất.", example: "The city has a vast ______ transport system." },

  { test: "Cam 17 Test 3", vocab: "Subsoil", meaning: "Lớp đất nền", type: "n", explanation: "Lớp đất nằm dưới lớp đất mặt.", example: "Engineers examined the ______ carefully." },

  { test: "Cam 17 Test 3", vocab: "Amenity", meaning: "Tiện ích", type: "n", explanation: "Cơ sở vật chất mang lại sự thuận tiện.", example: "Parks are valuable urban ______." },

  { test: "Cam 17 Test 3", vocab: "Enclave", meaning: "Khu dân cư biệt lập", type: "n", explanation: "Khu vực tách biệt với xung quanh.", example: "The wealthy lived in a private ______." },

  { test: "Cam 17 Test 3", vocab: "Waterfront", meaning: "Khu ven sông / biển", type: "n", explanation: "Khu vực tiếp giáp mặt nước.", example: "The old warehouses were converted into ______ apartments." },

  { test: "Cam 17 Test 3", vocab: "Caisson", meaning: "Trụ móng", type: "n", explanation: "Kết cấu lớn dùng làm móng dưới nước hoặc dưới đất.", example: "Workers installed a massive ______ under the bridge." },
  
  // Cam 17 Test 4
  { test: "Cam 17 Test 4", vocab: "Staple", meaning: "Chủ yếu, thiết yếu", type: "adj", explanation: "Được sử dụng hoặc tiêu thụ thường xuyên, đóng vai trò nền tảng trong đời sống hằng ngày hoặc trong một hệ thống.", example: "Rice is a staple food in many Asian countries." },

  { test: "Cam 17 Test 4", vocab: "Vast", meaning: "Rộng lớn", type: "adj", explanation: "Có quy mô, diện tích hoặc số lượng rất lớn, khó đo đếm hết.", example: "Vast areas of forest were destroyed." },

  { test: "Cam 17 Test 4", vocab: "Subsistence", meaning: "Tự cung tự cấp", type: "n", explanation: "Cách sống hoặc sản xuất chỉ đủ đáp ứng các nhu cầu cơ bản để tồn tại.", example: "Many families still depend on subsistence farming." },

  { test: "Cam 17 Test 4", vocab: "Paddy", meaning: "Ruộng lúa", type: "n", explanation: "Cánh đồng ngập nước chuyên dùng để trồng lúa.", example: "The paddy fields looked beautiful at sunset." },

  { test: "Cam 17 Test 4", vocab: "Insectivorous", meaning: "Ăn côn trùng", type: "adj", explanation: "Mô tả động vật lấy côn trùng làm nguồn thức ăn chính.", example: "Bats are highly insectivorous animals." },

  { test: "Cam 17 Test 4", vocab: "Devastating", meaning: "Tàn phá", type: "adj", explanation: "Gây ra thiệt hại nghiêm trọng về vật chất, tinh thần hoặc môi trường.", example: "The disease had a devastating impact on crops." },

  { test: "Cam 17 Test 4", vocab: "Thrive", meaning: "Phát triển mạnh", type: "v", explanation: "Sinh trưởng, phát triển hoặc thành công trong điều kiện thuận lợi.", example: "Bats thrive in warm climates." },

  { test: "Cam 17 Test 4", vocab: "Feast", meaning: "Ăn no nê", type: "v", explanation: "Ăn một lượng lớn thức ăn với sự thích thú hoặc sung túc.", example: "The bats feast on insects every night." },

  { test: "Cam 17 Test 4", vocab: "Indigenous", meaning: "Bản địa", type: "adj", explanation: "Có nguồn gốc tự nhiên và tồn tại lâu đời ở một khu vực cụ thể.", example: "These plants are indigenous to Vietnam." },

  { test: "Cam 17 Test 4", vocab: "Take advantage of", meaning: "Tận dụng", type: "v", explanation: "Sử dụng hiệu quả cơ hội, nguồn lực hoặc điều kiện thuận lợi để đạt mục tiêu.", example: "Farmers take advantage of natural resources." },

  { test: "Cam 17 Test 4", vocab: "Swarm", meaning: "Đàn côn trùng", type: "n", explanation: "Một nhóm lớn côn trùng hoặc động vật nhỏ di chuyển cùng nhau.", example: "A swarm of locusts destroyed the fields." },

  { test: "Cam 17 Test 4", vocab: "Scarce", meaning: "Khan hiếm", type: "adj", explanation: "Có số lượng ít và không dễ tìm hoặc tiếp cận.", example: "Food became scarce during the drought." },

  { test: "Cam 17 Test 4", vocab: "Roost", meaning: "Trú ngụ", type: "v", explanation: "Nghỉ ngơi hoặc ngủ ở một nơi cố định, thường dùng với chim hoặc dơi.", example: "Bats roost in caves during the day." },

  { test: "Cam 17 Test 4", vocab: "Sacred", meaning: "Thiêng liêng", type: "adj", explanation: "Được tôn kính hoặc gắn với tín ngưỡng, tôn giáo hay giá trị tinh thần sâu sắc.", example: "The mountain is considered sacred." },

  { test: "Cam 17 Test 4", vocab: "Compile", meaning: "Biên soạn, tổng hợp", type: "v", explanation: "Thu thập và sắp xếp thông tin từ nhiều nguồn thành một tài liệu hoàn chỉnh.", example: "We are trying to compile a list of suitable people for the job." },

  { test: "Cam 17 Test 4", vocab: "Ledger", meaning: "Sổ cái", type: "n", explanation: "Sổ ghi chép các giao dịch tài chính hoặc dữ liệu kế toán một cách hệ thống.", example: "All donations were recorded in a ledger by the committee." },

  { test: "Cam 17 Test 4", vocab: "Obey", meaning: "Tuân theo", type: "v", explanation: "Làm theo mệnh lệnh, quy tắc hoặc yêu cầu từ người có thẩm quyền.", example: "He was arrested when he failed to obey a police instruction." },

  { test: "Cam 17 Test 4", vocab: "Reprimand", meaning: "Khiển trách", type: "v", explanation: "Phê bình nghiêm khắc vì hành vi không phù hợp.", example: "The judge reprimanded him for using such language in court." },

  { test: "Cam 17 Test 4", vocab: "Weave", meaning: "Dệt", type: "v", explanation: "Đan hoặc kết hợp các sợi, vật liệu để tạo thành cấu trúc hoàn chỉnh.", example: "Most spiders weave webs that are almost invisible." },

  { test: "Cam 17 Test 4", vocab: "Ordinance", meaning: "Quy định, sắc lệnh", type: "n", explanation: "Quy tắc hoặc luật lệ được ban hành bởi chính quyền hoặc cơ quan có thẩm quyền.", example: "A city ordinance says parks must be closed at 11 p.m." },

  { test: "Cam 17 Test 4", vocab: "Far from", meaning: "Gần như không", type: "phrase", explanation: "Dùng để nhấn mạnh điều gì đó hoàn toàn trái ngược với suy nghĩ thông thường.", example: "Computers, far from destroying jobs, can create employment." },

  { test: "Cam 17 Test 4", vocab: "Straightforward", meaning: "Đơn giản, dễ hiểu", type: "adj", explanation: "Rõ ràng, trực tiếp và không phức tạp khi thực hiện hoặc hiểu.", example: "It's quite straightforward to get here." },

  { test: "Cam 17 Test 4", vocab: "Bodice", meaning: "Áo thân trên của phụ nữ", type: "n", explanation: "Phần áo ôm thân trên trong váy hoặc trang phục nữ truyền thống.", example: "She was wearing a ballgown with a fitted bodice." },

  { test: "Cam 17 Test 4", vocab: "Shed", meaning: "Tỏa ra, chiếu ra", type: "v", explanation: "Phát ra ánh sáng, nhiệt hoặc một thứ gì đó lan tỏa ra ngoài.", example: "The candles shed a soft glow on her face." },

  { test: "Cam 17 Test 4", vocab: "Unfold", meaning: "Dần lộ ra", type: "v", explanation: "Diễn biến hoặc xuất hiện từng bước theo thời gian.", example: "Dramatic events were about to unfold." },

  { test: "Cam 17 Test 4", vocab: "Sermon", meaning: "Bài thuyết giáo", type: "n", explanation: "Bài nói mang tính tôn giáo hoặc đạo đức nhằm truyền đạt thông điệp.", example: "She preached a sermon on forgiveness." },

  { test: "Cam 17 Test 4", vocab: "Chastise", meaning: "Quở trách", type: "v", explanation: "Phê bình hoặc trách phạt ai đó vì lỗi lầm.", example: "He chastised the team for their lack of commitment." },

  { test: "Cam 17 Test 4", vocab: "Punishment", meaning: "Hình phạt", type: "n", explanation: "Biện pháp xử lý được áp dụng khi ai đó vi phạm quy định.", example: "The punishment should fit the crime." },

  { test: "Cam 17 Test 4", vocab: "Spinster", meaning: "Phụ nữ chưa chồng", type: "n", explanation: "Cách gọi truyền thống chỉ phụ nữ lớn tuổi chưa kết hôn.", example: "The sisters remained spinsters all their lives." },

  { test: "Cam 17 Test 4", vocab: "Mediocre", meaning: "Tầm thường", type: "adj", explanation: "Chỉ ở mức trung bình hoặc dưới mức kỳ vọng, không nổi bật.", example: "I thought the book was pretty mediocre." },

  { test: "Cam 17 Test 4", vocab: "Undermine", meaning: "Làm suy yếu", type: "v", explanation: "Làm giảm sức mạnh, sự tin tưởng hoặc hiệu quả của điều gì đó.", example: "This crisis has undermined his position." },

  { test: "Cam 17 Test 4", vocab: "The uninitiated", meaning: "Người ngoại đạo", type: "n", explanation: "Những người chưa có kiến thức hoặc kinh nghiệm trong một lĩnh vực cụ thể.", example: "To the uninitiated, the system seems too complicated." },

  { test: "Cam 17 Test 4", vocab: "Call for", meaning: "Đòi hỏi", type: "v", explanation: "Yêu cầu hoặc khiến cần phải có một hành động cụ thể.", example: "The situation calls for prompt action." },

  { test: "Cam 17 Test 4", vocab: "Go back", meaning: "Có từ, tồn tại từ", type: "v", explanation: "Có nguồn gốc hoặc tồn tại từ một thời điểm trong quá khứ.", example: "Their family goes back to the time of the Pilgrim Fathers." },

  { test: "Cam 17 Test 4", vocab: "Simultaneous", meaning: "Đồng thời", type: "adj", explanation: "Xảy ra cùng một lúc hoặc trong cùng thời điểm.", example: "There were several simultaneous attacks by the rebels." },

  { test: "Cam 17 Test 4", vocab: "Accomplished", meaning: "Tài năng, thành thạo", type: "adj", explanation: "Có kỹ năng cao nhờ học tập, luyện tập hoặc kinh nghiệm.", example: "She was an elegant and accomplished woman." },

  { test: "Cam 17 Test 4", vocab: "Run through", meaning: "Diễn tập", type: "v", explanation: "Thực hành hoặc xem lại toàn bộ một quy trình hay màn trình diễn.", example: "Can we run through Scene 3 again, please?" },

  { test: "Cam 17 Test 4", vocab: "Play out", meaning: "Diễn ra", type: "v", explanation: "Xảy ra hoặc phát triển đến kết quả cuối cùng.", example: "Their love affair was played out against the backdrop of war." },

  { test: "Cam 17 Test 4", vocab: "Exceptional", meaning: "Phi thường", type: "adj", explanation: "Vượt xa mức bình thường về chất lượng, khả năng hoặc thành tích.", example: "At the age of five he showed exceptional talent." },

  { test: "Cam 17 Test 4", vocab: "Gifted", meaning: "Có năng khiếu", type: "adj", explanation: "Có khả năng tự nhiên nổi trội trong một lĩnh vực nào đó.", example: "She was extremely gifted at poetry." },

  { test: "Cam 17 Test 4", vocab: "Dedicate", meaning: "Cống hiến", type: "v", explanation: "Dành thời gian, công sức hoặc tâm huyết cho một mục tiêu.", example: "She dedicates herself to her work." },

  { test: "Cam 17 Test 4", vocab: "Set in", meaning: "Bắt đầu xuất hiện", type: "v", explanation: "Bắt đầu và có xu hướng kéo dài hoặc ảnh hưởng rõ rệt.", example: "The rain seemed to have set in for the day." },

  { test: "Cam 17 Test 4", vocab: "Patchy", meaning: "Chắp vá, không đồng đều", type: "adj", explanation: "Không liên tục, không ổn định hoặc có chất lượng không nhất quán.", example: "It was a patchy performance." },

  { test: "Cam 17 Test 4", vocab: "Fragmented", meaning: "Phân mảnh", type: "adj", explanation: "Bị chia nhỏ, thiếu liên kết hoặc thiếu sự thống nhất.", example: "Efforts were fragmented across multiple teams." },

  { test: "Cam 17 Test 4", vocab: "Forthcoming", meaning: "Sắp tới", type: "adj", explanation: "Sẽ xảy ra, được công bố hoặc xuất hiện trong tương lai gần.", example: "Keep an eye on the noticeboards for forthcoming events." },

  { test: "Cam 17 Test 4", vocab: "Have", meaning: "Sai khiến", type: "v", explanation: "Khiến hoặc yêu cầu người khác thực hiện một hành động nào đó.", example: "He had the bouncers throw them out." },

  { test: "Cam 17 Test 4", vocab: "Recall", meaning: "Ghi nhớ", type: "v", explanation: "Nhớ lại thông tin, sự kiện hoặc ký ức trong quá khứ.", example: "She could not recall his name." },

  { test: "Cam 17 Test 4", vocab: "Tentative", meaning: "Tạm thời, chưa chắc chắn", type: "adj", explanation: "Chưa được xác nhận hoàn toàn và có thể thay đổi.", example: "We made a tentative arrangement." },

  { test: "Cam 17 Test 4", vocab: "Unpublished", meaning: "Chưa xuất bản", type: "adj", explanation: "Chưa được phát hành công khai dưới dạng sách, báo hoặc tài liệu.", example: "Much of his writing remains unpublished." },
  
  // Cam 18 Test 3
  { test: "Cam 18 Test 3", vocab: "Slag", meaning: "Xỉ thải luyện kim", type: "n", explanation: "Phần vật liệu thải ra trong quá trình nung chảy hoặc tinh luyện kim loại.", example: "The slag from the furnace was discarded." },

  { test: "Cam 18 Test 3", vocab: "Byproduct", meaning: "Sản phẩm phụ", type: "n", explanation: "Sản phẩm được tạo ra ngoài sản phẩm chính trong một quá trình sản xuất hoặc phản ứng.", example: "The production process generates a byproduct that can be reused." },

  { test: "Cam 18 Test 3", vocab: "High-rise", meaning: "Tòa nhà cao tầng", type: "adj", explanation: "Mô tả công trình có nhiều tầng, thường xuất hiện ở đô thị hiện đại.", example: "The city skyline is dominated by high-rise buildings." },

  { test: "Cam 18 Test 3", vocab: "Indication", meaning: "Dấu hiệu", type: "n", explanation: "Một tín hiệu hoặc bằng chứng cho thấy điều gì đó đang hoặc sắp xảy ra.", example: "The dark clouds are an indication of an incoming storm." },

  { test: "Cam 18 Test 3", vocab: "Abundance", meaning: "Sự phong phú", type: "n", explanation: "Tình trạng có số lượng rất nhiều hoặc dồi dào.", example: "The garden was filled with an abundance of flowers." },

  { test: "Cam 18 Test 3", vocab: "Viable", meaning: "Khả thi", type: "adj", explanation: "Có khả năng thực hiện thành công trong điều kiện thực tế.", example: "The project seems viable and worth pursuing." },

  { test: "Cam 18 Test 3", vocab: "Moisture", meaning: "Độ ẩm", type: "n", explanation: "Lượng nước hoặc hơi nước tồn tại trong không khí, đất hoặc vật liệu.", example: "The plant needs moisture to grow." },

  { test: "Cam 18 Test 3", vocab: "Absorb", meaning: "Hấp thụ", type: "v", explanation: "Tiếp nhận hoặc hút chất lỏng, năng lượng hoặc thông tin vào bên trong.", example: "The sponge can absorb a lot of water." },

  { test: "Cam 18 Test 3", vocab: "Adhesive", meaning: "Chất kết dính", type: "n", explanation: "Vật liệu dùng để gắn hoặc liên kết hai bề mặt với nhau.", example: "The adhesive helps in sticking things together." },

  { test: "Cam 18 Test 3", vocab: "Crosswise", meaning: "Theo chiều ngang", type: "adj", explanation: "Được sắp xếp hoặc cắt theo chiều ngang thay vì chiều dọc.", example: "She cut the fabric crosswise." },

  { test: "Cam 18 Test 3", vocab: "Property", meaning: "Tính chất", type: "n", explanation: "Đặc điểm vật lý, hóa học hoặc chức năng vốn có của một chất hoặc vật liệu.", example: "This material has excellent insulating properties." },

  { test: "Cam 18 Test 3", vocab: "Novel", meaning: "Mới lạ", type: "adj", explanation: "Mang tính sáng tạo, khác biệt hoặc chưa từng được áp dụng trước đó.", example: "The researchers proposed a novel solution." },

  { test: "Cam 18 Test 3", vocab: "Substance", meaning: "Chất", type: "n", explanation: "Một dạng vật chất có thành phần và đặc tính xác định.", example: "Some materials contain toxic substances." },

  { test: "Cam 18 Test 3", vocab: "Underpinned", meaning: "Được củng cố", type: "adj", explanation: "Được hỗ trợ hoặc làm vững chắc bởi bằng chứng, lý thuyết hoặc nền tảng nào đó.", example: "The theory is underpinned by research." },

  { test: "Cam 18 Test 3", vocab: "Marvellous", meaning: "Tuyệt vời", type: "adj", explanation: "Rất ấn tượng, đáng ngạc nhiên theo hướng tích cực.", example: "The results were marvellous." },

  { test: "Cam 18 Test 3", vocab: "Mouldable", meaning: "Có thể đúc", type: "adj", explanation: "Có thể dễ dàng tạo hình hoặc thay đổi hình dạng khi tác động.", example: "The clay is soft and mouldable." },

  { test: "Cam 18 Test 3", vocab: "Pourable", meaning: "Có thể đổ", type: "adj", explanation: "Có độ lỏng phù hợp để chảy hoặc đổ vào khuôn chứa.", example: "The liquid concrete is pourable." },

  { test: "Cam 18 Test 3", vocab: "Reinforce", meaning: "Gia cố", type: "v", explanation: "Làm cho cấu trúc, ý tưởng hoặc hệ thống trở nên chắc chắn hơn.", example: "Workers reinforced the foundation." },

  { test: "Cam 18 Test 3", vocab: "Medieval", meaning: "Thời Trung cổ", type: "adj", explanation: "Thuộc giai đoạn lịch sử châu Âu từ khoảng thế kỷ 5 đến 15.", example: "The castle dates back to medieval times." },

  { test: "Cam 18 Test 3", vocab: "Proven in practice", meaning: "Được chứng minh thực tế", type: "adj", explanation: "Đã được kiểm chứng hiệu quả qua ứng dụng thực tế thay vì chỉ lý thuyết.", example: "The method has been proven in practice." },

  { test: "Cam 18 Test 3", vocab: "Primitive", meaning: "Thô sơ, nguyên thủy", type: "adj", explanation: "Đơn giản, chưa phát triển hoặc thuộc giai đoạn ban đầu.", example: "Early engines were primitive compared with modern machines." },

  { test: "Cam 18 Test 3", vocab: "Evolve into", meaning: "Phát triển thành", type: "v", explanation: "Dần thay đổi và trở thành một hình thức hoặc trạng thái mới.", example: "Over time, simple machines evolved into complex systems." },

  { test: "Cam 18 Test 3", vocab: "Miniaturized", meaning: "Được thu nhỏ", type: "adj", explanation: "Được thiết kế hoặc chuyển đổi thành phiên bản nhỏ gọn hơn.", example: "The miniaturized device fits into your pocket." },

  { test: "Cam 18 Test 3", vocab: "Reservoir", meaning: "Bể chứa", type: "n", explanation: "Nơi lưu trữ chất lỏng hoặc nguồn cung dự trữ cho hệ thống.", example: "The reservoir stores water for the engine." },

  { test: "Cam 18 Test 3", vocab: "Shortcoming", meaning: "Thiếu sót", type: "n", explanation: "Điểm yếu hoặc hạn chế trong thiết kế, kế hoạch hoặc năng lực.", example: "One shortcoming of the design was its weight." },

  { test: "Cam 18 Test 3", vocab: "Phase out", meaning: "Loại bỏ dần", type: "v", explanation: "Ngừng sử dụng hoặc sản xuất một cách từ từ theo lộ trình.", example: "The company decided to phase out old technology." },

  { test: "Cam 18 Test 3", vocab: "Rekindle", meaning: "Khơi lại", type: "v", explanation: "Làm cho sự quan tâm, cảm xúc hoặc hoạt động trở nên mạnh mẽ trở lại.", example: "The project rekindled interest in steam vehicles." },

  { test: "Cam 18 Test 3", vocab: "Wrecked", meaning: "Bị phá hỏng", type: "adj", explanation: "Bị hư hại nghiêm trọng đến mức khó sử dụng hoặc sửa chữa.", example: "The wrecked car was removed from the road." },

  { test: "Cam 18 Test 3", vocab: "Comprise", meaning: "Bao gồm", type: "v", explanation: "Được tạo thành từ nhiều thành phần hoặc bộ phận khác nhau.", example: "The system comprises several mechanical parts." },

  { test: "Cam 18 Test 3", vocab: "Reconfigure", meaning: "Thiết kế lại", type: "v", explanation: "Thay đổi cách sắp xếp hoặc cấu trúc để tối ưu hiệu quả.", example: "Engineers had to reconfigure the design." },

  { test: "Cam 18 Test 3", vocab: "Prototype", meaning: "Nguyên mẫu", type: "n", explanation: "Phiên bản đầu tiên của một sản phẩm được tạo ra để thử nghiệm.", example: "The company built a prototype for testing." },

  { test: "Cam 18 Test 3", vocab: "Internal combustion engine", meaning: "Động cơ đốt trong", type: "n", explanation: "Loại động cơ tạo năng lượng bằng cách đốt nhiên liệu bên trong buồng đốt.", example: "Most cars today use an internal combustion engine." },

  { test: "Cam 18 Test 3", vocab: "Clattering", meaning: "Phát ra tiếng lạch cạch", type: "adj", explanation: "Tạo ra âm thanh va chạm liên tục của kim loại hoặc vật cứng.", example: "The old engine made a clattering noise." },

  { test: "Cam 18 Test 3", vocab: "Aroma", meaning: "Mùi hương", type: "n", explanation: "Mùi đặc trưng, thường dễ nhận biết và có thể dễ chịu.", example: "The aroma of fuel filled the workshop." },

  { test: "Cam 18 Test 3", vocab: "Swift", meaning: "Nhanh", type: "adj", explanation: "Di chuyển hoặc phản ứng với tốc độ cao.", example: "The new model was surprisingly swift." },

  { test: "Cam 18 Test 3", vocab: "Emit", meaning: "Phát ra", type: "v", explanation: "Thải hoặc giải phóng khí, ánh sáng, âm thanh hoặc năng lượng.", example: "The engine emits less pollution." },

  { test: "Cam 18 Test 3", vocab: "Deposit", meaning: "Tiền đặt cọc", type: "n", explanation: "Khoản tiền trả trước để giữ chỗ hoặc đảm bảo giao dịch.", example: "Customers paid a deposit to reserve the vehicle." },

  { test: "Cam 18 Test 3", vocab: "Key-based ignition", meaning: "Hệ thống khởi động bằng chìa khóa", type: "n", explanation: "Cơ chế khởi động phương tiện bằng cách dùng chìa khóa cơ học.", example: "Most modern vehicles use key-based ignition." },

  { test: "Cam 18 Test 3", vocab: "Sluggish", meaning: "Chậm chạp", type: "adj", explanation: "Thiếu tốc độ, phản ứng chậm hoặc hoạt động kém linh hoạt.", example: "The old vehicle felt sluggish on hills." },

  { test: "Cam 18 Test 3", vocab: "Plague", meaning: "Gây trục trặc", type: "v", explanation: "Liên tục gây ra vấn đề, khó khăn hoặc phiền toái.", example: "Technical issues continued to plague the design." },

  { test: "Cam 18 Test 3", vocab: "Glitches", meaning: "Lỗi nhỏ", type: "n", explanation: "Những lỗi nhỏ hoặc trục trặc tạm thời trong hệ thống.", example: "The software update fixed several glitches." },

  { test: "Cam 18 Test 3", vocab: "Erratic", meaning: "Thất thường", type: "adj", explanation: "Không ổn định, khó dự đoán hoặc thay đổi bất thường.", example: "The engine showed erratic performance." },

  { test: "Cam 18 Test 3", vocab: "Tinker", meaning: "Mày mò sửa chữa", type: "v", explanation: "Thử sửa hoặc điều chỉnh thiết bị bằng cách thực hành trực tiếp.", example: "He likes to tinker with old engines." },

  { test: "Cam 18 Test 3", vocab: "Fold", meaning: "Phá sản", type: "v", explanation: "Ngừng hoạt động kinh doanh do không thể tiếp tục duy trì.", example: "The company was forced to fold." },

  { test: "Cam 18 Test 3", vocab: "Adamant", meaning: "Kiên quyết", type: "adj", explanation: "Giữ lập trường rất chắc chắn và không dễ thay đổi.", example: "He remained adamant about his decision." },

  { test: "Cam 18 Test 3", vocab: "Negligible", meaning: "Không đáng kể", type: "adj", explanation: "Quá nhỏ để tạo ra ảnh hưởng hoặc đáng quan tâm.", example: "The difference in cost was negligible." },

  { test: "Cam 18 Test 3", vocab: "Kerosene", meaning: "Dầu hỏa", type: "n", explanation: "Một loại nhiên liệu lỏng được tinh chế từ dầu mỏ.", example: "The lamp was fueled by kerosene." },

  { test: "Cam 18 Test 3", vocab: "Go out of business", meaning: "Ngừng kinh doanh", type: "v", explanation: "Chấm dứt hoạt động thương mại hoặc đóng cửa công ty.", example: "Many small manufacturers went out of business." },

  { test: "Cam 18 Test 3", vocab: "Tentative", meaning: "Tạm thời", type: "adj", explanation: "Chưa chắc chắn hoàn toàn và có thể thay đổi sau đó.", example: "They reached a tentative agreement." },

  { test: "Cam 18 Test 3", vocab: "Textual evidence", meaning: "Bằng chứng từ văn bản", type: "n", explanation: "Thông tin hoặc chi tiết trong tài liệu dùng để hỗ trợ lập luận.", example: "Support your answer with textual evidence." },

  { test: "Cam 18 Test 3", vocab: "Advocate", meaning: "Ủng hộ", type: "v", explanation: "Công khai hỗ trợ hoặc bảo vệ một ý tưởng, chính sách hoặc nhóm người.", example: "Many educators advocate inclusive classrooms." },

  { test: "Cam 18 Test 3", vocab: "Levels of attainment", meaning: "Mức độ tiếp thu", type: "n", explanation: "Mức độ thành tích hoặc kết quả học tập đạt được.", example: "Students show different levels of attainment." },

  { test: "Cam 18 Test 3", vocab: "Selective school", meaning: "Trường tuyển chọn", type: "n", explanation: "Trường chỉ nhận học sinh đạt tiêu chuẩn đầu vào nhất định.", example: "He attended a selective school." },

  { test: "Cam 18 Test 3", vocab: "Comprehensive", meaning: "Toàn diện", type: "adj", explanation: "Bao quát đầy đủ nhiều khía cạnh hoặc nhiều nhóm đối tượng.", example: "Comprehensive schools accept students of all abilities." },

  { test: "Cam 18 Test 3", vocab: "Straggler", meaning: "Người tụt lại", type: "n", explanation: "Người di chuyển hoặc tiến bộ chậm hơn nhóm còn lại.", example: "The teacher encouraged every straggler." },

  { test: "Cam 18 Test 3", vocab: "Mediocrity", meaning: "Sự tầm thường", type: "n", explanation: "Mức chất lượng chỉ ở mức trung bình, thiếu sự nổi bật.", example: "He refused to accept mediocrity." },

  { test: "Cam 18 Test 3", vocab: "Prevail", meaning: "Chiếm ưu thế", type: "v", explanation: "Chiến thắng, thành công hoặc trở nên nổi trội sau cạnh tranh.", example: "Determination helped her prevail." },

  { test: "Cam 18 Test 3", vocab: "Frustrate", meaning: "Làm nản lòng", type: "v", explanation: "Khiến ai đó cảm thấy thất vọng hoặc mất động lực.", example: "Repeated failure can frustrate students." },

  { test: "Cam 18 Test 3", vocab: "Stroll", meaning: "Cuộc đi dạo", type: "n", explanation: "Một hoạt động đi bộ thư thả và không vội vàng.", example: "They went for a stroll after class." },

  { test: "Cam 18 Test 3", vocab: "Zone of proximal development", meaning: "Vùng phát triển gần", type: "n", explanation: "Khái niệm giáo dục chỉ khoảng kỹ năng người học có thể đạt được khi được hỗ trợ.", example: "The theory emphasizes the zone of proximal development." },

  { test: "Cam 18 Test 3", vocab: "Scaffolding", meaning: "Giàn giáo học tập", type: "n", explanation: "Phương pháp hỗ trợ từng bước giúp người học phát triển kỹ năng.", example: "Scaffolding helps students learn gradually." },

  { test: "Cam 18 Test 3", vocab: "Be capable of", meaning: "Có khả năng", type: "phrase", explanation: "Có năng lực hoặc tiềm năng để thực hiện điều gì đó.", example: "Every child is capable of improvement." },

  { test: "Cam 18 Test 3", vocab: "Pedagogical paradigm", meaning: "Mô hình sư phạm", type: "n", explanation: "Khung lý thuyết hoặc phương pháp định hướng hoạt động giảng dạy.", example: "The school adopted a new pedagogical paradigm." },

  { test: "Cam 18 Test 3", vocab: "Constructivism", meaning: "Chủ nghĩa kiến tạo", type: "n", explanation: "Lý thuyết học tập cho rằng người học tự xây dựng kiến thức qua trải nghiệm.", example: "Constructivism emphasizes active learning." },

  { test: "Cam 18 Test 3", vocab: "Emerge out of", meaning: "Nảy sinh từ", type: "v", explanation: "Xuất hiện hoặc phát triển từ một nguồn gốc hoặc quá trình nào đó.", example: "New ideas emerge out of collaboration." },

  { test: "Cam 18 Test 3", vocab: "Constructivist", meaning: "Thuộc chủ nghĩa kiến tạo", type: "adj", explanation: "Liên quan đến phương pháp học tập lấy người học làm trung tâm.", example: "She uses a constructivist approach." },

  { test: "Cam 18 Test 3", vocab: "Zeal", meaning: "Lòng nhiệt huyết", type: "n", explanation: "Sự đam mê và quyết tâm mạnh mẽ đối với một mục tiêu.", example: "His zeal inspired the class." },

  { test: "Cam 18 Test 3", vocab: "At the expense of", meaning: "Đánh đổi bằng", type: "phrase", explanation: "Đạt được điều gì đó nhưng gây thiệt hại cho điều khác.", example: "Success should not come at the expense of others." },

  { test: "Cam 18 Test 3", vocab: "Lookout", meaning: "Người quan sát", type: "n", explanation: "Người được giao nhiệm vụ quan sát và cảnh báo nguy hiểm.", example: "The lookout warned the group of danger." },

  // Cam 18 Test 4
  { test: "Cam 18 Test 4", vocab: "Replicate", meaning: "Sao chép", type: "v", explanation: "Tạo ra bản sao hoặc lặp lại một quá trình, mô hình hay kết quả giống bản gốc.", example: "The successful business model of the company led other entrepreneurs to replicate it in their own ventures." },

  { test: "Cam 18 Test 4", vocab: "Norm", meaning: "Chuẩn mực", type: "n", explanation: "Quy tắc, hành vi hoặc tiêu chuẩn được xã hội hoặc một nhóm người chấp nhận rộng rãi.", example: "In some cultures, it is the norm to greet others with a bow instead of a handshake." },

  { test: "Cam 18 Test 4", vocab: "Greenery", meaning: "Cây xanh", type: "n", explanation: "Cây cối, thảm thực vật hoặc không gian có nhiều cây xanh tạo cảm giác tự nhiên.", example: "The park is known for its lush greenery and beautiful flower beds." },

  { test: "Cam 18 Test 4", vocab: "Mitigate", meaning: "Giảm thiểu", type: "v", explanation: "Làm giảm mức độ nghiêm trọng, tác động hoặc hậu quả tiêu cực của một vấn đề.", example: "Planting trees around buildings can help mitigate the effects of air pollution." },

  { test: "Cam 18 Test 4", vocab: "Cope", meaning: "Đối phó", type: "v", explanation: "Xử lý hoặc thích nghi với những tình huống khó khăn, áp lực hoặc thử thách.", example: "She developed effective coping mechanisms to deal with stress and anxiety." },

  { test: "Cam 18 Test 4", vocab: "Prescribe", meaning: "Kê đơn", type: "v", explanation: "Chỉ định thuốc, phương pháp điều trị hoặc giải pháp bởi chuyên gia có thẩm quyền.", example: "The dentist will prescribe antibiotics to prevent infection after the tooth extraction." },

  { test: "Cam 18 Test 4", vocab: "Dementia", meaning: "Chứng mất trí", type: "n", explanation: "Nhóm bệnh làm suy giảm trí nhớ, tư duy và khả năng thực hiện hoạt động thường ngày.", example: "Engaging in mentally stimulating activities can potentially lower the risk of developing dementia in old age." },

  { test: "Cam 18 Test 4", vocab: "Obesity", meaning: "Béo phì", type: "n", explanation: "Tình trạng tích tụ mỡ quá mức trong cơ thể gây ảnh hưởng đến sức khỏe.", example: "Unhealthy eating habits and a sedentary lifestyle can contribute to obesity." },

  { test: "Cam 18 Test 4", vocab: "Cultivate", meaning: "Trồng trọt", type: "v", explanation: "Canh tác đất đai hoặc phát triển kỹ năng, phẩm chất thông qua quá trình rèn luyện.", example: "She has learned how to cultivate a variety of herbs and spices in her backyard garden." },

  { test: "Cam 18 Test 4", vocab: "Radical urban design", meaning: "Thiết kế đô thị cấp tiến", type: "n", explanation: "Cách tiếp cận quy hoạch đô thị mang tính đột phá, khác biệt với mô hình truyền thống.", example: "The architect proposed a radical urban design that challenged traditional city planning concepts." },

  { test: "Cam 18 Test 4", vocab: "Monumental problem", meaning: "Vấn đề lớn", type: "n", explanation: "Một thách thức rất lớn, phức tạp và đòi hỏi nhiều nguồn lực để giải quyết.", example: "Solving homelessness is a monumental problem that requires the collective effort of society." },

  { test: "Cam 18 Test 4", vocab: "Access to resources", meaning: "Truy cập vào tài nguyên", type: "n", explanation: "Khả năng tiếp cận các nguồn lực như giáo dục, công nghệ, tài chính hoặc dịch vụ.", example: "Providing equal access to resources such as education and healthcare is essential for a fair and just society." },

  { test: "Cam 18 Test 4", vocab: "Rooftop space", meaning: "Không gian trên sân thượng", type: "n", explanation: "Khu vực trên mái nhà có thể được tận dụng cho sinh hoạt, trồng cây hoặc giải trí.", example: "The unused rooftop space of the building was transformed into a vibrant rooftop garden." },

  { test: "Cam 18 Test 4", vocab: "Forward-thinking policy", meaning: "Chính sách hướng tới tương lai", type: "n", explanation: "Chính sách được xây dựng với tầm nhìn dài hạn, chú trọng phát triển bền vững.", example: "The city implemented a forward-thinking policy to reduce carbon emissions and promote sustainability." },

  { test: "Cam 18 Test 4", vocab: "Notion", meaning: "Khái niệm", type: "n", explanation: "Ý tưởng, quan điểm hoặc niềm tin về một sự vật hay hiện tượng.", example: "The notion of working together as a team was inspiring." },

  { test: "Cam 18 Test 4", vocab: "Innate intelligence", meaning: "Trí thông minh bẩm sinh", type: "n", explanation: "Khả năng tư duy, học hỏi hoặc giải quyết vấn đề có sẵn từ khi sinh ra.", example: "Mozart's innate intelligence in music was evident from a young age." },

  { test: "Cam 18 Test 4", vocab: "Progressive thinker", meaning: "Nhà tư tưởng tiến bộ", type: "n", explanation: "Người có tư duy đổi mới, cởi mở và sẵn sàng thách thức quan điểm truyền thống.", example: "As a progressive thinker, she always seeks new solutions to societal issues." },

  { test: "Cam 18 Test 4", vocab: "Revolt against", meaning: "Chống lại", type: "v", explanation: "Nổi dậy hoặc phản kháng mạnh mẽ chống lại quyền lực hoặc hệ thống.", example: "The citizens decided to revolt against the oppressive regime." },

  { test: "Cam 18 Test 4", vocab: "Take root", meaning: "Bén rễ", type: "v", explanation: "Bắt đầu phát triển, được chấp nhận hoặc trở nên vững chắc theo thời gian.", example: "The idea of democracy began to take root in the country." },

  { test: "Cam 18 Test 4", vocab: "Supplant", meaning: "Thay thế", type: "v", explanation: "Thay thế một người, hệ thống hoặc phương pháp bằng thứ khác hiệu quả hơn.", example: "The new technology may supplant traditional methods of communication." },

  { test: "Cam 18 Test 4", vocab: "Cognitive ability", meaning: "Khả năng nhận thức", type: "n", explanation: "Khả năng tư duy, ghi nhớ, học tập, suy luận và xử lý thông tin.", example: "Memory is an essential cognitive ability for learning." },

  { test: "Cam 18 Test 4", vocab: "Inherent ability", meaning: "Khả năng vốn có", type: "n", explanation: "Năng lực tự nhiên có sẵn trong một người từ đầu.", example: "His inherent ability to solve complex problems impressed everyone." },

  { test: "Cam 18 Test 4", vocab: "Concentrate", meaning: "Tập trung", type: "v", explanation: "Dồn toàn bộ sự chú ý hoặc nỗ lực vào một nhiệm vụ cụ thể.", example: "To improve focus, you should try to concentrate on one task at a time." },

  { test: "Cam 18 Test 4", vocab: "Coax", meaning: "Dỗ dành", type: "v", explanation: "Thuyết phục ai đó bằng sự nhẹ nhàng, kiên nhẫn hoặc khuyến khích.", example: "The teacher tried to coax the shy student to participate." },

  { test: "Cam 18 Test 4", vocab: "Fixed mindset", meaning: "Tư duy cố định", type: "n", explanation: "Quan điểm cho rằng năng lực và trí thông minh là cố định, khó thay đổi.", example: "People with a fixed mindset avoid challenges to protect their self-esteem." },

  { test: "Cam 18 Test 4", vocab: "Self-esteem", meaning: "Lòng tự trọng", type: "n", explanation: "Cảm nhận tích cực hoặc tiêu cực của một người về giá trị bản thân.", example: "Building self-esteem is essential for a positive self-image." },

  { test: "Cam 18 Test 4", vocab: "Sense of worth", meaning: "Cảm giác có giá trị", type: "n", explanation: "Nhận thức rằng bản thân có ý nghĩa, năng lực hoặc đóng góp tích cực.", example: "She gained a sense of worth after receiving the award." },

  { test: "Cam 18 Test 4", vocab: "Psychologist", meaning: "Nhà tâm lý học", type: "n", explanation: "Chuyên gia nghiên cứu hành vi, cảm xúc và quá trình tư duy của con người.", example: "The psychologist helped him cope with anxiety." },

  { test: "Cam 18 Test 4", vocab: "Praise", meaning: "Khen", type: "v", explanation: "Thể hiện sự đánh giá cao hoặc công nhận thành tích của ai đó.", example: "The teacher praised the students for their excellent performance." },

  { test: "Cam 18 Test 4", vocab: "Instill", meaning: "Truyền đạt, thấm nhuần", type: "v", explanation: "Dần dần đưa một giá trị, niềm tin hoặc thái độ vào suy nghĩ của người khác.", example: "Parents try to instill good values in their children." },

  { test: "Cam 18 Test 4", vocab: "Infer", meaning: "Suy luận", type: "v", explanation: "Rút ra kết luận dựa trên bằng chứng, dữ kiện hoặc quan sát.", example: "Based on the evidence, we can infer that he is guilty." },

  { test: "Cam 18 Test 4", vocab: "Emphasize", meaning: "Nhấn mạnh", type: "v", explanation: "Làm nổi bật hoặc cho thấy tầm quan trọng của điều gì đó.", example: "The coach will emphasize the importance of teamwork." },

  { test: "Cam 18 Test 4", vocab: "Interpret", meaning: "Diễn giải", type: "v", explanation: "Giải thích ý nghĩa của thông tin, sự kiện hoặc tác phẩm theo cách hiểu.", example: "The students will interpret the poem in different ways." },

  { test: "Cam 18 Test 4", vocab: "Morale", meaning: "Tinh thần", type: "n", explanation: "Mức độ tự tin, động lực hoặc tinh thần tích cực trong một nhóm.", example: "The team meeting improved morale among the employees." },

  { test: "Cam 18 Test 4", vocab: "Misapply", meaning: "Ứng dụng sai", type: "v", explanation: "Áp dụng quy tắc, lý thuyết hoặc phương pháp không đúng cách.", example: "It is important not to misapply the rules of the game." },

  { test: "Cam 18 Test 4", vocab: "Concept", meaning: "Khái niệm", type: "n", explanation: "Ý tưởng hoặc nguyên tắc trừu tượng dùng để giải thích sự vật, hiện tượng.", example: "The concept of time is complex and multifaceted." },

  { test: "Cam 18 Test 4", vocab: "Intervention", meaning: "Sự can thiệp", type: "n", explanation: "Hành động tham gia để thay đổi, hỗ trợ hoặc cải thiện một tình huống.", example: "The teacher provided additional intervention for struggling students." },

  { test: "Cam 18 Test 4", vocab: "Adolescent", meaning: "Thanh thiếu niên", type: "n", explanation: "Người trong giai đoạn phát triển từ trẻ em sang người trưởng thành.", example: "Adolescent students often experience peer pressure." },

  { test: "Cam 18 Test 4", vocab: "Misappropriate", meaning: "Sử dụng sai", type: "v", explanation: "Chiếm dụng hoặc sử dụng tài sản, thông tin không đúng mục đích.", example: "The research findings were misappropriated by other scientists." },

  { test: "Cam 18 Test 4", vocab: "Conflate", meaning: "Đánh đồng", type: "v", explanation: "Kết hợp hoặc nhầm lẫn hai khái niệm khác nhau thành một.", example: "It is important not to conflate correlation with causation." },

  { test: "Cam 18 Test 4", vocab: "Cope with", meaning: "Đối phó với", type: "v", explanation: "Quản lý hoặc xử lý thành công một tình huống khó khăn.", example: "She had to cope with the stress of final exams." },

  { test: "Cam 18 Test 4", vocab: "Admirable", meaning: "Đáng ngưỡng mộ", type: "adj", explanation: "Gây ấn tượng tích cực và khiến người khác tôn trọng.", example: "Her dedication to helping others is truly admirable." },

  { test: "Cam 18 Test 4", vocab: "Deserve", meaning: "Xứng đáng", type: "v", explanation: "Có quyền hoặc nên nhận được điều gì đó dựa trên hành động hoặc phẩm chất.", example: "They deserve recognition for their hard work." },

  { test: "Cam 18 Test 4", vocab: "Coverage", meaning: "Phạm vi đưa tin", type: "n", explanation: "Mức độ hoặc phạm vi thông tin được truyền thông hoặc hệ thống đề cập.", example: "The news channel provides extensive coverage of world events." },

  { test: "Cam 18 Test 4", vocab: "Elixir", meaning: "Tiên dược", type: "n", explanation: "Theo nghĩa đen là thuốc thần; nghĩa bóng là giải pháp tưởng như hoàn hảo.", example: "There is no magical elixir for success; it takes hard work and dedication." },

  { test: "Cam 18 Test 4", vocab: "Proponent", meaning: "Người ủng hộ", type: "n", explanation: "Người tích cực bảo vệ, quảng bá hoặc ủng hộ một ý tưởng.", example: "He is a proponent of renewable energy solutions." },

  { test: "Cam 18 Test 4", vocab: "Strive", meaning: "Phấn đấu", type: "v", explanation: "Nỗ lực mạnh mẽ để đạt được mục tiêu hoặc cải thiện bản thân.", example: "Despite facing challenges, she continues to strive for excellence." },

  { test: "Cam 18 Test 4", vocab: "Deluded notion", meaning: "Quan niệm sai lầm", type: "n", explanation: "Niềm tin không thực tế hoặc sai lệch về bản thân hay thế giới.", example: "His deluded notion of invincibility led to risky behavior." },

  { test: "Cam 18 Test 4", vocab: "Dissonance", meaning: "Sự bất hòa", type: "n", explanation: "Sự không nhất quán, mâu thuẫn hoặc thiếu hòa hợp giữa các yếu tố.", example: "The dissonance between her actions and words was confusing." },

  { test: "Cam 18 Test 4", vocab: "Philosophy", meaning: "Triết lý", type: "n", explanation: "Hệ thống tư tưởng hoặc quan điểm nền tảng về cuộc sống hoặc một lĩnh vực.", example: "His philosophy on life emphasizes kindness and gratitude." },

  { test: "Cam 18 Test 4", vocab: "Concrete", meaning: "Cụ thể", type: "adj", explanation: "Rõ ràng, thực tế và có thể quan sát hoặc kiểm chứng được.", example: "She provided concrete examples to support her argument." },

  { test: "Cam 18 Test 4", vocab: "Continental drift", meaning: "Sự trôi dạt lục địa", type: "n", explanation: "Lý thuyết cho rằng các lục địa di chuyển dần theo thời gian địa chất.", example: "The theory of continental drift suggests that the continents were once connected and have since moved apart." },

  { test: "Cam 18 Test 4", vocab: "Dispute", meaning: "Tranh chấp", type: "v", explanation: "Phản đối, không đồng ý hoặc thách thức tính đúng đắn của điều gì đó.", example: "I tried to dispute the bill with the waiter." },

  { test: "Cam 18 Test 4", vocab: "Laterally", meaning: "Theo chiều ngang", type: "adv", explanation: "Di chuyển hoặc phát triển theo hướng ngang thay vì dọc.", example: "The tectonic plates move laterally along their boundaries." },

  { test: "Cam 18 Test 4", vocab: "Plate tectonics", meaning: "Mảng kiến tạo", type: "n", explanation: "Lý thuyết giải thích sự chuyển động của các mảng vỏ Trái Đất.", example: "Plate tectonics explains the movement of Earth's lithosphere on the semi-fluid asthenosphere." },

  { test: "Cam 18 Test 4", vocab: "Evolutionary theory", meaning: "Thuyết tiến hóa", type: "n", explanation: "Lý thuyết khoa học giải thích sự thay đổi của sinh vật qua thời gian.", example: "Darwin's evolutionary theory proposed natural selection as the driving force of species adaptation." },

  { test: "Cam 18 Test 4", vocab: "Biological evolution", meaning: "Tiến hóa sinh học", type: "n", explanation: "Quá trình sinh vật thay đổi đặc điểm di truyền qua nhiều thế hệ.", example: "Biological evolution accounts for the diversity and adaptation of living organisms over time." },

  { test: "Cam 18 Test 4", vocab: "Hazardous exploration", meaning: "Chuyến khám phá nguy hiểm", type: "n", explanation: "Hoạt động nghiên cứu hoặc thám hiểm có mức độ rủi ro cao.", example: "The hazardous exploration of the deep-sea trench revealed new species previously unknown to science." },

  { test: "Cam 18 Test 4", vocab: "Biographer", meaning: "Người viết tiểu sử", type: "n", explanation: "Người nghiên cứu và viết về cuộc đời của một cá nhân khác.", example: "The biographer meticulously documented the life and achievements of the Nobel laureate." },

  { test: "Cam 18 Test 4", vocab: "Narrow investigation", meaning: "Nghiên cứu hẹp", type: "n", explanation: "Nghiên cứu tập trung vào một phạm vi hoặc khía cạnh rất cụ thể.", example: "The narrow investigation focused solely on the chemical properties of the compound." },

  { test: "Cam 18 Test 4", vocab: "Intriguing", meaning: "Hấp dẫn", type: "adj", explanation: "Khơi gợi sự tò mò, quan tâm hoặc muốn khám phá thêm.", example: "The findings of the study were intriguing and raised further research questions." },

  { test: "Cam 18 Test 4", vocab: "Astronomer", meaning: "Nhà thiên văn học", type: "n", explanation: "Nhà khoa học nghiên cứu các thiên thể và hiện tượng trong vũ trụ.", example: "The astronomer observed the celestial event through a powerful telescope." },

  { test: "Cam 18 Test 4", vocab: "Pursue", meaning: "Theo đuổi", type: "v", explanation: "Dành thời gian và nỗ lực để đạt mục tiêu, nghề nghiệp hoặc nghiên cứu.", example: "The young scientist decided to pursue a career in neuroscience." },

  { test: "Cam 18 Test 4", vocab: "Aloft", meaning: "Trên cao", type: "adv", explanation: "Ở vị trí cao trong không trung hoặc phía trên mặt đất.", example: "The weather balloon was aloft, collecting data on atmospheric conditions." },

  { test: "Cam 18 Test 4", vocab: "Thermodynamics", meaning: "Nhiệt động học", type: "n", explanation: ":contentReference[oaicite:1]{index=1} nghiên cứu mối quan hệ giữa nhiệt, năng lượng và công.", example: "Thermodynamics is the branch of physics that deals with heat and its relation to energy." },

  { test: "Cam 18 Test 4", vocab: "Urge", meaning: "Thúc giục", type: "v", explanation: "Khuyến khích mạnh mẽ hoặc thúc đẩy ai đó hành động.", example: "The mentor would often urge the students to pursue innovative ideas fearlessly." },

  { test: "Cam 18 Test 4", vocab: "Index", meaning: "Mục lục", type: "n", explanation: "Danh sách được sắp xếp có hệ thống để giúp tìm kiếm thông tin nhanh hơn.", example: "The scientific database contained an index of relevant research articles." },

  { test: "Cam 18 Test 4", vocab: "Sufficient", meaning: "Đầy đủ", type: "adj", explanation: "Có số lượng hoặc chất lượng đáp ứng nhu cầu hoặc yêu cầu đặt ra.", example: "The evidence presented was deemed sufficient to support the hypothesis." },

  { test: "Cam 18 Test 4", vocab: "Entail", meaning: "Kéo theo", type: "v", explanation: "Bao hàm, dẫn đến hoặc yêu cầu điều gì đó như hệ quả tất yếu.", example: "Conducting a comprehensive study can entail a substantial investment of time and resources." },

  { test: "Cam 18 Test 4", vocab: "Retrospectively", meaning: "Hồi cứu", type: "adv", explanation: "Xem xét hoặc phân tích lại điều gì đó sau khi nó đã xảy ra.", example: "The researchers analyzed the data retrospectively to identify trends." },

  { test: "Cam 18 Test 4", vocab: "Happenstance", meaning: "Sự ngẫu nhiên", type: "n", explanation: "Một sự kiện xảy ra tình cờ mà không có kế hoạch trước.", example: "The discovery of the new species was a happenstance during a routine survey." },

  { test: "Cam 18 Test 4", vocab: "Coherent narrative", meaning: "Câu chuyện mạch lạc", type: "n", explanation: "Chuỗi thông tin hoặc lập luận được trình bày logic và dễ theo dõi.", example: "The scientist presented a coherent narrative to explain the complex phenomenon." },

  { test: "Cam 18 Test 4", vocab: "Paleontology", meaning: "Cổ sinh vật học", type: "n", explanation: ":contentReference[oaicite:2]{index=2} nghiên cứu sinh vật cổ đại thông qua hóa thạch.", example: "Paleontology is the scientific study of ancient life through fossils and remains." },

  { test: "Cam 18 Test 4", vocab: "Climatology", meaning: "Khí hậu học", type: "n", explanation: ":contentReference[oaicite:3]{index=3} nghiên cứu các mô hình khí hậu dài hạn của Trái Đất.", example: "Climatology examines the long-term patterns and variations of Earth's climate." },

  { test: "Cam 18 Test 4", vocab: "Meteorologist", meaning: "Nhà khí tượng học", type: "n", explanation: "Nhà khoa học nghiên cứu thời tiết, khí quyển và dự báo khí tượng.", example: "The meteorologist predicted heavy rainfall for the upcoming week." },
  
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
  1: 1 * 60 * 60 * 1000,     // Level 1 -> Level 2: Chờ 1 giờ
  2: 12 * 60 * 60 * 1000,     // Level 2 -> Level 3: Chờ 12 giờ
  3: 1 * 24 * 60 * 60 * 1000, // Level 3 -> Level 4: Chờ 1 ngày
  4: 3 * 24 * 60 * 60 * 1000,// Level 4 -> Level 5: Chờ 3 ngày
  5: 7 * 24 * 60 * 60 * 1000 // Level 5: Ôn lại sau 1 tuần
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